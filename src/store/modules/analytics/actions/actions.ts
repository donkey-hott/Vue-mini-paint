import axios from "axios";
import { ActionTree } from "vuex";
import { State } from "../state";
import { State as RootState } from "@/store";
import { Actions, ActionTypes } from "./action-types";

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.FETCH_VISITS]() {
    const res = await axios.get(
      `${process.env.VUE_APP_SERVER_HOST}/api/analytics/getEventsByType?type=ROUTE_CHANGE`
    );

    return res.data;
  },
};
