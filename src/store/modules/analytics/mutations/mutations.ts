import { MutationTypes, Mutations } from "./mutation-types";
import { State } from "../state";
import { MutationTree } from "vuex";

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_VISITS_BY_TIME](state, payload) {
    state.visitsByTime = payload;
  },
  [MutationTypes.SET_VISITS_BY_PAGES](state, payload) {
    state.visitsByPages = payload;
  },
};
