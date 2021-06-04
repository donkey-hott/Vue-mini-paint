import {
  MutationTypes,
  Mutations,
} from "@/store/modules/onboarding/mutations/mutation-types";
import { State } from "@/store/modules/onboarding/state";
import { state as authenticationState } from "@/store/modules/auth/state";
import { MutationTree } from "vuex";

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ADD_ELEMENTS](state, payload) {
    const { config } = state;
    state.config = [...config, ...payload];
  },
};
