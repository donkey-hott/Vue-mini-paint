import { Mutations } from "@/store/modules/auth/mutations/mutation-types";
import { mutations } from "@/store/modules/auth/mutations/mutations";
import { Actions } from "./actions/action-types";
import { actions } from "@/store/modules/auth/actions/actions";
import { state } from "@/store/modules/auth/state";

import {
  CommitOptions,
  DispatchOptions,
  Module,
  Store as VuexStore,
} from "vuex";
import { State } from "@/store/modules/auth/state";
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
  // getters: {
  //   [K in keyof Getters]: ReturnType<Getters[K]>;
  // };
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
};

export const auth: Module<State, RootState> = {
  state,
  mutations,
  actions,
};
