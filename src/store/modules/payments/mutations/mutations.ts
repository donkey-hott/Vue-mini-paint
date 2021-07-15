import {
  MutationTypes,
  Mutations,
} from "@/store/modules/payments/mutations/mutation-types";
import { State } from "@/store/modules/payments/state";
import { MutationTree } from "vuex";

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_PLAN](state, payload) {
    state.plan = payload;
  },
};
