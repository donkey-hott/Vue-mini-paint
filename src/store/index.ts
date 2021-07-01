import { createStore } from "vuex";

import { auth, Store as AuthStore } from "@/store/modules/auth";
import { State as AuthState } from "@/store/modules/auth/state";

import { pictures, Store as PictureStore } from "@/store/modules/pictures";
import { State as PictureState } from "@/store/modules/pictures/state";
import { rootActions as actions } from "@/store/modules/root/actions/actions";

import { analytics, Store as AnalyticsStore } from "./modules/analytics";
import { State as AnalyticsState } from "./modules/analytics/state";

export type State = {
  auth: AuthState;
  pictures: PictureState;
  analytics: AnalyticsState;
};

export type Store = AuthStore<Pick<State, "auth">> &
  PictureStore<Pick<State, "pictures">> &
  AnalyticsStore<Pick<State, "analytics">>;

export const store = createStore({
  modules: { auth, pictures, analytics },
  actions,
});

export function useStore(): Store {
  return store as Store;
}

export default store;
