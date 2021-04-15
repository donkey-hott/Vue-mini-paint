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

export interface Actions {
  [ActionTypes.SIGN_UP](
    { commit }: AugmentedActionContext,
    payload: UserCredentials
  ): void;
  [ActionTypes.SIGN_IN](
    { commit }: AugmentedActionContext,
    payload: UserCredentials
  ): void;
  [ActionTypes.LOG_OUT](): void;
}

export const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.SIGN_UP]({ commit }, payload: UserCredentials) {
    const { email, password } = payload;
    const userCredentials = await firebase
      .app()
      .auth()
      .createUserWithEmailAndPassword(email, password);
    commit(MutationTypes.SET_USER, userCredentials);
  },

  async [ActionTypes.SIGN_IN]({ commit }, payload: UserCredentials) {
    const { email, password } = payload;
    const userCredentials = await firebase
      .app()
      .auth()
      .signInWithEmailAndPassword(email, password);
    commit(MutationTypes.SET_USER, userCredentials);
  },
  async [ActionTypes.LOG_OUT]() {
    await firebase.app().auth().signOut();
  },
};
