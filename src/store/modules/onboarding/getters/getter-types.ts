import { OnboardingVersion } from "@/store/types";
import { State } from "../state";

export type Getters = {
  getVersionById(
    state: State
  ): (versionId: string) => OnboardingVersion | undefined;
};
