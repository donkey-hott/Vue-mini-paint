export enum ActionTypes {
  SEND_ONBOARDING_INFO = "SEND_ONBOARDING_INFO",
  HANDLE_ONBOARDING = "HANDLE_ONBOARDING",
}

import firebase from "firebase";
import { ActionContext } from "vuex";
import { Mutations } from "../mutations/mutation-types";
import { State as RootState } from "@/store";
import { State } from "../state";

export type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
  [ActionTypes.HANDLE_ONBOARDING](
    context: AugmentedActionContext,
    payload: firebase.User | null
  ): void;
  [ActionTypes.SEND_ONBOARDING_INFO](
    context: AugmentedActionContext,
    payload: string
  ): void;
}
