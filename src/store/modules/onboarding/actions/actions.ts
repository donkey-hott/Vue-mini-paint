import { ActionTree } from "vuex";
import { State as RootState } from "@/store";
import { State } from "../state";
import { Actions, ActionTypes } from "./action-types";
import firebase from "firebase";
import { MutationTypes } from "../mutations/mutation-types";
import { getDiffOfObjArrays } from "@/utils/getDiffOfObjArrays";
import { OnboardingStep } from "@/store/types";

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.HANDLE_ONBOARDING](context, payload) {
    firebase
      .database()
      .ref(payload?.uid)
      .child("onboarding")
      .on("value", (snapshot) => {
        if (!payload) return;
        const snapshotValue = snapshot.val();

        /* if user hasn't seen onboarding at all */
        if (!snapshotValue) {
          return context.commit(MutationTypes.SHOW_ONBOARDING, true);
        }

        const userOnboardingVersion = JSON.parse(
          snapshotValue?.version
        ) as Array<OnboardingStep>;
        const currentOnboardingVersion = context.state.config;
        const diffBetweenOnboardingVersions = getDiffOfObjArrays(
          userOnboardingVersion,
          currentOnboardingVersion,
          "elementId"
        );
        // console.log(userOnboardingVersion, currentOnboardingVersion);

        /* if version that has user seen differs from current one, replace
          current version with difference between them */
        if (diffBetweenOnboardingVersions.length !== 0) {
          console.log("difference is:", diffBetweenOnboardingVersions);
          return context.commit(
            MutationTypes.REPLACE_CONFIG,
            diffBetweenOnboardingVersions as Array<OnboardingStep>
          );
        }
        /* if user has seen latest onboarding version, don't show him anything */
        console.log("difference is equal to 0");
      });
  },
};
