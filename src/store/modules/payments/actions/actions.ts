import axios from "axios";
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
    await axios({
      method: "POST",
      url: URLToChangeUserPlan.href,
      data: {
        userId: currentUser.uid,
        planType: UserPlanTypes.PREMIUM_PLAN,
      },
    });
  },

  async [ActionTypes.GET_PLAN_DETAILS](context, planType) {
    const URLToGetPlanDetails = new URL(
      `${process.env.VUE_APP_SERVER_HOST}/api/plans/getPlanDetails`
    );
    URLToGetPlanDetails.searchParams.set("plan", planType);
    const response = await axios.get(URLToGetPlanDetails.href);
    return response.data;
  },
};
