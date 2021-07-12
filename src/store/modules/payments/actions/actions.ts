import { ActionTree } from "vuex";
import { Actions, ActionTypes } from "./action-types";
import store, { State as RootState } from "@/store";
import { State } from "../state";
import { MutationTypes } from "../mutations/mutation-types";
import { MutationTypes as AuthMutationTypes } from "../../auth/mutations/mutation-types";

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.GET_USER_SUBSCRIPTION_PLAN](context) {
    const userId = context.rootState.auth.currentUser?.uid;
    if (!userId) return;

    const middlewareURL = new URL(
      "http://localhost:3000/api/users/getUserSubscriptionPlan"
    );
    middlewareURL.searchParams.set("userId", userId);

    fetch(middlewareURL.href)
      .then((res) => res.json())
      .then((data: string | null) =>
        context.commit(MutationTypes.SET_PLAN, data)
      );
  },
  async [ActionTypes.SUBSCRIBE_TO_PREMIUM](context) {
    const { currentUser, userProfile } = context.rootState.auth;
    if (!currentUser || !userProfile) return;

    const changeUserPlanURL = new URL(
      `${process.env.VUE_APP_SERVER_HOST}/api/users/setUserSubscriptionPlan`
    );
    changeUserPlanURL.searchParams.set("userId", currentUser.uid);
    changeUserPlanURL.searchParams.set("plan", "premium");

    const res = await fetch(changeUserPlanURL.href);
    const data = await res.json();

    store.commit(AuthMutationTypes.SET_PROFILE, data);
  },
};
