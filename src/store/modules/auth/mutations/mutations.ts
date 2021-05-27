import {
  MutationTypes,
  Mutations,
} from "@/store/modules/auth/mutations/mutation-types";
import { State } from "@/store/modules/auth/state";
import { MutationTree } from "vuex";

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_USER](state, payload) {
    state.currentUser = payload;
  },
};
