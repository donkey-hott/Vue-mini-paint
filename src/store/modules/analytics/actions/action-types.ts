import { ActionContext } from "vuex";
import { Mutations } from "../mutations/mutation-types";
import { State as RootState } from "@/store";
import { State } from "../state";

export enum ActionTypes {
  FETCH_VISITS = "FETCH_VISITS",
}

export interface Actions {
  [ActionTypes.FETCH_VISITS]({
    commit,
  }: AugmentedActionContext): Promise<Array<{ [key: string]: string }>>;
}

export type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key?: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;
