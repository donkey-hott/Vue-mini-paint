import { ActionTree } from "vuex";
import { State } from "../state";
import { State as RootState } from "@/store";
import { Actions, ActionTypes } from "./action-types";

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.FETCH_VISITS]() {
    return fetch(
      `${process.env.VUE_APP_SERVER_HOST}/api/analytics/getEventsByType?type=ROUTE_CHANGE`
    ).then((res) => res.json());
  },
};
