import { ActionTree } from "vuex";
import { Actions, ActionTypes } from "./action-types";
import { State as RootState } from "@/store";
import { State } from "../state";
import { UserPlanTypes } from "@/store/types";

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.SUBSCRIBE_TO_PREMIUM](context) {
    const { currentUser, userProfile } = context.rootState.auth;
    if (!currentUser || !userProfile) return;

    /* 
      update subscription plan in the database
      and get its details from the server
    */
    const URLToChangeUserPlan = new URL(
      `${process.env.VUE_APP_SERVER_HOST}/api/plans/subscribeUserToPremium`
    );

    await fetch(URLToChangeUserPlan.href, {
      method: "POST",
      body: JSON.stringify({
        userId: currentUser.uid,
        planType: UserPlanTypes.PREMIUM_PLAN,
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },

  async [ActionTypes.GET_PLAN_DETAILS](context, planType) {
    const URLToGetPlanDetails = new URL(
      `${process.env.VUE_APP_SERVER_HOST}/api/plans/getPlanDetails`
    );
    URLToGetPlanDetails.searchParams.set("plan", planType);

    const response = await fetch(URLToGetPlanDetails.href);
    return await response.json();
  },
};
