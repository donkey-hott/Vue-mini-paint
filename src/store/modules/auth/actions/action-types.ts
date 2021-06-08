import { UserCredentials } from "@/store/types";
import { ActionContext } from "vuex";
import { Mutations } from "../mutations/mutation-types";
import { State as RootState } from "@/store";
import { State } from "../state";

export enum ActionTypes {
  SIGN_UP = "SIGN_UP",
  SIGN_IN = "SIGN_IN",
  LOG_OUT = "LOG_OUT",
}

export interface Actions {
  [ActionTypes.SIGN_UP](
    { commit }: AugmentedActionContext,
    payload: UserCredentials
  ): void;
  [ActionTypes.SIGN_IN](
    { commit }: AugmentedActionContext,
    payload: UserCredentials
  ): void;
  [ActionTypes.LOG_OUT](context: AugmentedActionContext): Promise<void>;
}

export type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key?: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;
