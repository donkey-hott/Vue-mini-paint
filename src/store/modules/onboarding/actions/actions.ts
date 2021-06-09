import { ActionTree } from "vuex";
import { State as RootState } from "@/store";
import { State } from "../state";
import { Actions, ActionTypes } from "./action-types";
import firebase from "firebase";
import { MutationTypes } from "../mutations/mutation-types";
import { getDiffOfObjArrays } from "@/utils/getDiffOfObjArrays";
import { OnboardingStep, OnboardingVersion } from "@/store/types";

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.HANDLE_ONBOARDING_INFO](context, payload) {
    return new Promise((resolve) => {
      firebase
        .database()
        .ref(payload?.uid)
        .child("onboardingVersion")
        .on("value", (snapshot) => {
          if (!payload) return resolve();
          const userOnboardingVersionId = snapshot.val() as string | null;

          /* if user hasn't seen onboarding at all */
          if (!userOnboardingVersionId) {
            context.commit(MutationTypes.SHOW_ONBOARDING, true);
            return resolve();
          }

          /* if version that has user seen differs from current one, replace
          current version with difference between them */
          const currentOnboardingVersion = context.state.versions.slice(-1)[0];
          if (currentOnboardingVersion.versionId !== userOnboardingVersionId) {
            const userOnboardingVersion = context.getters.getVersionById(
              userOnboardingVersionId
            );
            const diffBetweenOnboardingVersions = getDiffOfObjArrays(
              userOnboardingVersion.steps,
              currentOnboardingVersion.steps,
              "elementId"
            );
            const newVersion: OnboardingVersion = {
              versionId: currentOnboardingVersion.versionId,
              steps: diffBetweenOnboardingVersions as Array<OnboardingStep>,
            };

            context.commit(MutationTypes.SET_DISPLAYED_VERSION, newVersion);
            context.commit(MutationTypes.SHOW_ONBOARDING, true);
          }
          resolve();
        });
    });
  },
  [ActionTypes.SEND_ONBOARDING_INFO](context, payload) {
    const { currentUser } = context.rootState.auth;
    if (!currentUser) return;

    firebase
      .database()
      .ref(currentUser.uid)
      .child("onboardingVersion")
      .set(payload);
  },
};
