import {
  CommitOptions,
  DispatchOptions,
  Module,
  Store as VuexStore,
} from "vuex";
import { Actions } from "./actions/action-types";
import { actions } from "./actions/actions";

import { Mutations } from "./mutations/mutation-types";
import { mutations } from "./mutations/mutations";
import { Getters } from "./getters/getter-types";
import { getters } from "./getters/getters";

import { State, state } from "./state";
import { State as RootState } from "@/store";

export type Store<S = State> = Omit<
  VuexStore<S>,
  "commit" | "getters" | "dispatch"
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
};

export const pictures: Module<State, RootState> = {
  state,
  getters,
  mutations,
  actions,
};
