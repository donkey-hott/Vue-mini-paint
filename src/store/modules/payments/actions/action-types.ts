import { ActionContext } from "vuex";
import { Mutations } from "../mutations/mutation-types";
import { State as RootState } from "@/store";
import { State } from "../state";

export enum ActionTypes {
  SUBSCRIBE_TO_PREMIUM = "SUBSCRIBE_TO_PREMIUM",
  GET_PLAN_DETAILS = "GET_PLAN_DETAILS",
}

export interface Actions {
  [ActionTypes.SUBSCRIBE_TO_PREMIUM](context: AugmentedActionContext): void;
  [ActionTypes.GET_PLAN_DETAILS](
    context: AugmentedActionContext,
    payload: string
  ): Promise<{ [key: string]: any }>;
}

export type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key?: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;
