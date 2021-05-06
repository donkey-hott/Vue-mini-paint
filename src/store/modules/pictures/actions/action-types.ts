import { ActionContext } from "vuex";
import { Mutations } from "../mutations/mutation-types";
import { State } from "../state";
import { State as RootState } from "@/store";
import { DbRecord } from "@/utils/createDbRecord";

export enum ActionTypes {
  SAVE_PICTURE = "SAVE_PICTURE",
  LOAD_PICTURES = "LOAD_PICTURES",
}

export type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
  [ActionTypes.SAVE_PICTURE](
    context: AugmentedActionContext,
    payload: DbRecord | undefined
  ): Promise<void>;
  [ActionTypes.LOAD_PICTURES](context: AugmentedActionContext): Promise<void>;
}
