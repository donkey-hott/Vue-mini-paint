import { OnboardingVersion } from "@/store/types";
import { State } from "../state";

export enum MutationTypes {
  SHOW_ONBOARDING = "SHOW_ONBOARDING",
  SET_DISPLAYED_VERSION = "SET_DISPLAYED_VERSION",
}

export type Mutations<S = State> = {
  [MutationTypes.SHOW_ONBOARDING](state: S, payload: boolean): void;
  [MutationTypes.SET_DISPLAYED_VERSION](
    state: S,
    payload: OnboardingVersion
  ): void;
};
