import { GetterTree } from "vuex";
import { State as RootState } from "@/store";
import { State } from "../state";
import { Getters } from "./getter-types";
import { UserPlanTypes } from "@/store/types";

export const getters: GetterTree<State, RootState> & Getters = {
  isUserPremium(state) {
    return state.plan?.type === UserPlanTypes.PREMIUM_PLAN;
  },
  isDefaultUser(state) {
    return state.plan?.type === UserPlanTypes.DEFAULT_PLAN;
  },
};
