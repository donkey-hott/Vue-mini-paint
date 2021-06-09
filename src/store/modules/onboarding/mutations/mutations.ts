import {
  MutationTypes,
  Mutations,
} from "@/store/modules/onboarding/mutations/mutation-types";
import { State } from "@/store/modules/onboarding/state";
import { MutationTree } from "vuex";

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SHOW_ONBOARDING](state, payload) {
    state.showOnboarding = payload;
  },
  [MutationTypes.SET_DISPLAYED_VERSION](state, payload) {
    state.displayedVersion = payload;
  },
};
