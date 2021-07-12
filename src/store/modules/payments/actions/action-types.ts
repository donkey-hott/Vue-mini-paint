import { ActionContext } from "vuex";
import { Mutations } from "../mutations/mutation-types";
import { State as RootState } from "@/store";
import { State } from "../state";

export enum ActionTypes {
  GET_USER_SUBSCRIPTION_PLAN = "GET_USER_SUBSCRIPTION_PLAN",
  SUBSCRIBE_TO_PREMIUM = "SUBSCRIBE_TO_PREMIUM",
  GET_PREMIUM_PRICE = "GET_PREMIUM_PRICE",
}

export interface Actions {
  [ActionTypes.GET_USER_SUBSCRIPTION_PLAN](
    context: AugmentedActionContext
  ): void;
  [ActionTypes.SUBSCRIBE_TO_PREMIUM](context: AugmentedActionContext): void;
  [ActionTypes.GET_PREMIUM_PRICE](
    context: AugmentedActionContext
  ): Promise<any>;
}

export type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key?: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;
