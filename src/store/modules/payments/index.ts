import { state } from "@/store/modules/payments/state";
import { State } from "@/store/modules/payments/state";
import { State as RootState } from "@/store";

import { Mutations } from "@/store/modules/payments/mutations/mutation-types";
import { mutations } from "@/store/modules/payments/mutations/mutations";

import { Actions } from "./actions/action-types";
import { actions } from "@/store/modules/payments/actions/actions";

import { Getters } from "./getters/getter-types";
import { getters } from "./getters/getters";

import {
  CommitOptions,
  DispatchOptions,
  Module,
  Store as VuexStore,
} from "vuex";

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
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
};

export const payments: Module<State, RootState> = {
  state,
  getters,
  mutations,
  actions,
};
