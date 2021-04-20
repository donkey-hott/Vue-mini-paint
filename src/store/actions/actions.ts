import firebase from "firebase";
import { ActionTypes } from "./action-types";
import { ActionContext, ActionTree } from "vuex";

import { Mutations } from "../mutations/mutations";
import { MutationTypes } from "../mutations/mutation-types";

import { State } from "../state";
import { UserCredentials } from "../types";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

// ==== ACTIONS INTERFACE ====

export interface Actions {
  [ActionTypes.SIGN_UP](
    { commit }: AugmentedActionContext,
    payload: UserCredentials
  ): void;
  [ActionTypes.SIGN_IN](
    { commit }: AugmentedActionContext,
    payload: UserCredentials
  ): void;
  [ActionTypes.LOG_OUT](): Promise<void>;
  [ActionTypes.SAVE_PICTURE](
    context: AugmentedActionContext,
    payload: string | undefined
  ): Promise<void>;
  [ActionTypes.LOAD_PICTURES]({
    commit,
  }: AugmentedActionContext): Promise<void>;
}

// ==== FUNCTIONS ====

export const actions: ActionTree<State, State> & Actions = {
  // AUTHENTICATION LOGIC

  async [ActionTypes.SIGN_UP](_, payload: UserCredentials) {
    const { email, password } = payload;
    await firebase.app().auth().createUserWithEmailAndPassword(email, password);
  },
  async [ActionTypes.SIGN_IN](_, payload: UserCredentials) {
    const { email, password } = payload;
    await firebase.app().auth().signInWithEmailAndPassword(email, password);
  },
  async [ActionTypes.LOG_OUT]() {
    await firebase.app().auth().signOut();
  },

  // PICTURES LOGIC

  async [ActionTypes.SAVE_PICTURE](_, payload: string | undefined) {
    if (!payload) return;

    const userID = firebase.auth().currentUser?.uid;
    try {
      await firebase.database().ref(userID).child("pictures").push(payload);
      console.log("%cPicture has been saved", "color:#67FF3D");
    } catch (error) {
      console.error(error);
    }
  },
  async [ActionTypes.LOAD_PICTURES]({ commit }) {
    try {
      const userID = firebase.auth().currentUser?.uid;
      await firebase
        .database()
        .ref(userID)
        .child("pictures")
        .on("value", (snapshot) => {
          const pictures = snapshot.val();
          commit(MutationTypes.SET_PICTURES, pictures);
          console.log(
            "%cPictures have been loaded!",
            "color:#67FF3D",
            pictures
          );
        });
    } catch (error) {
      console.error(error);
    }
  },
};
