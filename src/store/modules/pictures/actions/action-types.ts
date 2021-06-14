import { ActionContext } from "vuex";
import { Mutations } from "../mutations/mutation-types";
import { State } from "../state";
import { State as RootState } from "@/store";
import { DbRecord } from "@/utils/createDbRecord";

export enum ActionTypes {
  SAVE_PICTURE = "SAVE_PICTURE",
  LOAD_PICTURES = "LOAD_PICTURES",
  GET_PUBLIC_PICTURES = "GET_PUBLIC_PICTURES",
  UPDATE_PUBLIC_PICTURES = "UPDATE_PUBLIC_PICTURES",
  ADD_PUBLIC_PICTURE = "ADD_PUBLIC_PICTURE",
}

export type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
  [ActionTypes.SAVE_PICTURE](
    context: AugmentedActionContext,
    payload: DbRecord | undefined
  ): Promise<void>;
  [ActionTypes.LOAD_PICTURES](context: AugmentedActionContext): Promise<void>;
  [ActionTypes.GET_PUBLIC_PICTURES](context: AugmentedActionContext): void;
  [ActionTypes.UPDATE_PUBLIC_PICTURES](content: AugmentedActionContext): void;
  [ActionTypes.ADD_PUBLIC_PICTURE](
    context: AugmentedActionContext,
    payload: string
  ): void;
}
