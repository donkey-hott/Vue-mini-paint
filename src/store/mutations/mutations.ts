import { MutationTree } from "vuex";
import { MutationTypes } from "./mutation-types";
import { State } from "../state";

// define type of the mutation below
export type Mutations<S = State> = {
  [MutationTypes.SET_USER](state: S, payload: any): void;
  [MutationTypes.REMOVE_USER](state: S): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_USER](state, payload: any) {
    state.currentUser = payload;
  },
  [MutationTypes.REMOVE_USER](state) {
    state.currentUser = null;
  },
};
