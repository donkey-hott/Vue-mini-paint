import firebase from "firebase";
import { ActionTypes } from "./action-types";
import { ActionContext, ActionTree } from "vuex";

import { Mutations } from "../mutations/mutations";
import { MutationTypes } from "../mutations/mutation-types";

import { State } from "../state";
import { Pictures, UserCredentials } from "../types";
import { DbRecord } from "../../utils/createDbRecord";

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
  [ActionTypes.LOG_OUT]({ commit }: AugmentedActionContext): Promise<void>;
  [ActionTypes.SAVE_PICTURE](
    context: AugmentedActionContext,
    payload: DbRecord | undefined
  ): Promise<void>;
  [ActionTypes.LOAD_PICTURES](context: AugmentedActionContext): Promise<void>;
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
  async [ActionTypes.LOG_OUT]({ commit }) {
    commit(MutationTypes.SET_USER, null);
    await firebase.app().auth().signOut();
  },

  // PICTURES LOGIC

  async [ActionTypes.SAVE_PICTURE](context, payload: DbRecord | undefined) {
    const currentUser: firebase.User | null = context.state.currentUser;
    if (!payload || !currentUser) return;
    // const { currentUser }: firebase.User | null = context.state;

    await firebase
      .database()
      .ref(currentUser?.uid)
      .child("pictures")
      .push(payload);
  },
  async [ActionTypes.LOAD_PICTURES](context) {
    const { currentUser } = context.state;
    if (!currentUser) return;
    try {
      await firebase
        .database()
        .ref(currentUser.uid)
        .child("pictures")
        .on("value", (snapshot) => {
          const pictures: Pictures = snapshot.val();
          context.commit(MutationTypes.SET_PICTURES, pictures);
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
