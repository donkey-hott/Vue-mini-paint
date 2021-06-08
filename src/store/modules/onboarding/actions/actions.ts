import { ActionTree } from "vuex";
import { State as RootState } from "@/store";
import { State } from "../state";
import { Actions, ActionTypes } from "./action-types";
import firebase from "firebase";
import { MutationTypes } from "../mutations/mutation-types";
import { getDiffOfObjArrays } from "@/utils/getDiffOfObjArrays";
import { OnboardingStep } from "@/store/types";
/* TODO: rename "handle onboarding" */
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
          snapshotValue
        ) as Array<OnboardingStep>;
        const currentOnboardingVersion = context.state.config;
        const diffBetweenOnboardingVersions = getDiffOfObjArrays(
          userOnboardingVersion,
          currentOnboardingVersion,
          "elementId"
        );

        /* if version that has user seen differs from current one, replace
          current version with difference between them */
        if (diffBetweenOnboardingVersions.length !== 0) {
          return context.commit(
            MutationTypes.REPLACE_CONFIG,
            diffBetweenOnboardingVersions as Array<OnboardingStep>
          );
        }
      });
  },
  [ActionTypes.SEND_ONBOARDING_INFO](context, payload) {
    const { currentUser } = context.rootState.auth;
    if (!currentUser) return;

    firebase.database().ref(currentUser.uid).child("onboarding").set(payload);
  },
};
