import { UserCredentials, UserProfile } from "@/store/types";
import firebase from "firebase";
import { ActionTree } from "vuex";
import { Actions, ActionTypes } from "./action-types";
import { State as RootState } from "@/store";
import { State } from "../state";
import { MutationTypes } from "../mutations/mutation-types";

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.SIGN_UP](context, payload: UserCredentials) {
    const { email, password } = payload;
    await firebase.app().auth().createUserWithEmailAndPassword(email, password);
  },
  async [ActionTypes.SIGN_IN](context, payload: UserCredentials) {
    const { email, password } = payload;
    await firebase.app().auth().signInWithEmailAndPassword(email, password);
  },
  async [ActionTypes.LOG_OUT]({ commit }) {
    commit(MutationTypes.SET_USER, null);
    await firebase.app().auth().signOut();
  },
  [ActionTypes.CREATE_PROFILE](context, payload) {
    const currentUser = context.rootState.auth.currentUser;
    if (!payload || !currentUser) return;

    firebase.database().ref(currentUser.uid).child("profile").set(payload);
  },
  [ActionTypes.LOAD_PROFILE](context) {
    const currentUser = context.rootState.auth.currentUser;
    if (!currentUser) {
      return Promise.reject(new Error("Current user is null"));
    }
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(currentUser.uid)
        .child("profile")
        .on("value", (snapshot) => {
          const profile = snapshot.val() as UserProfile | null;
          if (profile === null) {
            return reject(new Error("Profile is null"));
          }

          context.commit(MutationTypes.SET_PROFILE, profile);
          resolve(profile);
        });
    });
  },
};
