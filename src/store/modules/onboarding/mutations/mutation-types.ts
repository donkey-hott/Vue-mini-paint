import { OnboardingStep } from "@/store/types";
import { State } from "../state";

export enum MutationTypes {
  SHOW_ONBOARDING = "SHOW_ONBOARDING",
  REPLACE_CONFIG = "REPLACE_CONFIG",
}

export type Mutations<S = State> = {
  [MutationTypes.SHOW_ONBOARDING](state: S, payload: boolean): void;
  [MutationTypes.REPLACE_CONFIG](
    state: S,
    payload: Array<OnboardingStep>
  ): void;
};
