import { MutationTree } from "vuex";
import { MutationTypes } from "./mutation-types";
import { State } from "../state";

// define type of the mutation below
export type Mutations<S = State> = {
  [MutationTypes.SET_PICTURES](state: S, payload: any): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_PICTURES](state, payload: any) {
    state.userPictures = payload;
  },
};
