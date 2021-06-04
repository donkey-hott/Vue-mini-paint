import { createStore } from "vuex";

import { auth, Store as AuthStore } from "@/store/modules/auth";
import { State as AuthState } from "@/store/modules/auth/state";

import { pictures, Store as PictureStore } from "@/store/modules/pictures";
import { State as PictureState } from "@/store/modules/pictures/state";
import { rootActions as actions } from "@/store/modules/root/actions/actions";

import {
  onboarding,
  Store as OnboardingStore,
} from "@/store/modules/onboarding";
import { State as OnboardingState } from "@/store/modules/onboarding/state";

export type State = {
  auth: AuthState;
  pictures: PictureState;
  onboarding: OnboardingState;
};

export type Store = AuthStore<Pick<State, "auth">> &
  PictureStore<Pick<State, "pictures">> &
  OnboardingStore<Pick<State, "onboarding">>;

export const store = createStore({
  modules: { auth, pictures, onboarding },
  actions,
});

export function useStore(): Store {
  return store as Store;
}

export default store;
