import { createStore } from "vuex";

import { auth, Store as AuthStore } from "@/store/modules/auth";
import { State as AuthState } from "@/store/modules/auth/state";

import { pictures, Store as PictureStore } from "@/store/modules/pictures";
import { State as PictureState } from "@/store/modules/pictures/state";
import { rootActions as actions } from "@/store/modules/root/actions/actions";

export type State = {
  auth: AuthState;
  pictures: PictureState;
};

export type Store = AuthStore<Pick<State, "auth">> &
  PictureStore<Pick<State, "pictures">>;

export const store = createStore({
  modules: { auth, pictures },
  actions,
});

export function useStore(): Store {
  return store as Store;
}

export default store;
