import { MutationTree } from "vuex";
import { MutationTypes } from "./mutation-types";

import { State } from "../state";
import { Pictures } from "../types";
import firebase from "firebase";

export type Mutations<S = State> = {
  [MutationTypes.SET_PICTURES](state: S, payload: Pictures): void;
  [MutationTypes.SET_USER](state: S, payload: firebase.User | null): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_PICTURES](state, payload: Pictures) {
    state.userPictures = payload;
  },
  [MutationTypes.SET_USER](state, payload: firebase.User | null) {
    state.currentUser = payload;
  },
};
