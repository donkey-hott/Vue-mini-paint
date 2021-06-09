import { ActionTree } from "vuex";
import { State as RootState } from "@/store";
import { Actions, RootActions } from "./action-types";
import firebase from "firebase";
import { initializeFirebase } from "@/firebase/firebaseInitialization";
import { MutationTypes } from "../../auth/mutations/mutation-types";
import { ActionTypes } from "../../pictures/actions/action-types";
import { ActionTypes as OnboardingActionTypes } from "@/store/modules/onboarding/actions/action-types";

export const rootActions: ActionTree<RootState, RootState> & Actions = {
  [RootActions.INIT]({ commit, dispatch }) {
    return new Promise((resolve) => {
      initializeFirebase();
      firebase.auth().onAuthStateChanged((user) => {
        commit(MutationTypes.SET_USER, user);
        dispatch(ActionTypes.LOAD_PICTURES);
        dispatch(OnboardingActionTypes.HANDLE_ONBOARDING_INFO, user).then(() =>
          resolve()
        );
      });
    });
  },
};
