import { UserCredentials } from "@/store/types";
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
  [ActionTypes.SET_ONBOARDING_INFO](context, payload) {
    const { currentUser } = context.state;
    if (!currentUser) return;

    firebase.database().ref(currentUser.uid).child("onboarding").set(payload);
  },
};
