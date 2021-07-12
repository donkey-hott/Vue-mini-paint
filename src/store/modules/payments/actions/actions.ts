import { ActionTree } from "vuex";
import { Actions, ActionTypes } from "./action-types";
import store, { State as RootState } from "@/store";
import { State } from "../state";
import { MutationTypes } from "../mutations/mutation-types";
import { MutationTypes as AuthMutationTypes } from "../../auth/mutations/mutation-types";

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.GET_USER_SUBSCRIPTION_PLAN](context) {
    const userId = context.rootState.auth.currentUser?.uid;
    if (!userId) return;

    const middlewareURL = new URL(
      "http://localhost:3000/api/users/getUserSubscriptionPlan"
    );
    middlewareURL.searchParams.set("userId", userId);

    const response = await fetch(middlewareURL.href);
    const data = await response.json();
    context.commit(MutationTypes.SET_PLAN, data);
  },

  async [ActionTypes.SUBSCRIBE_TO_PREMIUM](context) {
    const { currentUser, userProfile } = context.rootState.auth;
    if (!currentUser || !userProfile) return;

    const URLToChangeUserPlan = new URL(
      `${process.env.VUE_APP_SERVER_HOST}/api/users/setUserSubscriptionPlan`
    );
    URLToChangeUserPlan.searchParams.set("userId", currentUser.uid);
    URLToChangeUserPlan.searchParams.set("plan", "premium");

    const res = await fetch(URLToChangeUserPlan.href);
    const data = await res.json();

    store.commit(AuthMutationTypes.SET_PROFILE, data);
    context.commit(MutationTypes.SET_PLAN, {
      type: "premium",
      price: 0.01,
    });
  },

  async [ActionTypes.GET_PREMIUM_PRICE](context) {
    const URLToGetPlanPrice = new URL(
      `${process.env.VUE_APP_SERVER_HOST}/api/users/getPlanPrice`
    );
    URLToGetPlanPrice.searchParams.set("plan", "premium");

    const response = await fetch(URLToGetPlanPrice.href);
    const data = await response.json();
    return Number(data);
  },
};
