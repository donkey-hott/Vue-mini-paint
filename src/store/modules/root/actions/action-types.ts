import { RootMutations } from "../mutations/mutation-types";
import { State as RootState } from "@/store";
import { ActionContext } from "vuex";
import firebase from "firebase";

export enum RootActions {
  INIT = "INIT",
}

export type AugmentedActionContext = {
  commit<K extends keyof RootMutations>(
    key: K,
    payload?: Parameters<RootMutations[K]>[1]
  ): ReturnType<RootMutations[K]>;
} & Omit<ActionContext<RootState, RootState>, "commit">;

export interface Actions {
  [RootActions.INIT](context: AugmentedActionContext): Promise<firebase.User | null
  >;
}
