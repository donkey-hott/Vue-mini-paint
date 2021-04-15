import { MutationTree } from "vuex";
import { MutationTypes } from "./mutation-types";
import { State } from "../state";
import firebase from "firebase";

// define type of the mutation below
export type Mutations<S = State> = {
  [MutationTypes.SET_USER](
    state: S,
    payload: firebase.auth.UserCredential
  ): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_USER](state, payload: firebase.auth.UserCredential) {
    state.currentUser = payload;
  },
};
