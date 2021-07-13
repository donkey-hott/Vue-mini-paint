import { ActionTree } from "vuex";
import { Actions, ActionTypes } from "./action-types";
import { State as RootState } from "@/store";
import { State } from "../state";
import { MutationTypes } from "../mutations/mutation-types";

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.GET_USER_SUBSCRIPTION_PLAN](context) {
    const userId = context.rootState.auth.currentUser?.uid;
    if (!userId) return;

    const middlewareURL = new URL(
      `${process.env.VUE_APP_SERVER_HOST}/api/users/getUserSubscriptionPlan`
    );
    middlewareURL.searchParams.set("userId", userId);

    const response = await fetch(middlewareURL.href);
    const planDetails = await response.json();
    context.commit(MutationTypes.SET_PLAN, planDetails);
  },

  async [ActionTypes.SUBSCRIBE_TO_PREMIUM](context) {
    const { currentUser, userProfile } = context.rootState.auth;
    if (!currentUser || !userProfile) return;

    /* 
      update subscription plan in the database
      and get its details from the server
    */
    const URLToChangeUserPlan = new URL(
      `${process.env.VUE_APP_SERVER_HOST}/api/users/setUserSubscriptionPlan`
    );
    URLToChangeUserPlan.searchParams.set("userId", currentUser.uid);
    URLToChangeUserPlan.searchParams.set("plan", "premium");

    const res = await fetch(URLToChangeUserPlan.href);
    const planDetails = await res.json();

    /* update subscription plan on the client */
    context.commit(MutationTypes.SET_PLAN, planDetails);
  },

  async [ActionTypes.GET_PREMIUM_PRICE](context) {
    const URLToGetPlanPrice = new URL(
      `${process.env.VUE_APP_SERVER_HOST}/api/users/getPlanPrice`
    );
    URLToGetPlanPrice.searchParams.set("plan", "premium");

    const response = await fetch(URLToGetPlanPrice.href);
    const price = await response.json();
    return Number(price);
  },
};
