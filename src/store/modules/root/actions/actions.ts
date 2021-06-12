import { ActionTree } from "vuex";
import { State as RootState } from "@/store";
import { Actions, RootActions } from "./action-types";
import firebase from "firebase";
import { initializeFirebase } from "@/firebase/firebaseInitialization";
import { MutationTypes } from "../../auth/mutations/mutation-types";
import { ActionTypes as PictureActionTypes } from "../../pictures/actions/action-types";
import { ActionTypes as AuthActionTypes } from "../../auth/actions/action-types";

export const rootActions: ActionTree<RootState, RootState> & Actions = {
  [RootActions.INIT]({ commit, dispatch }) {
    return new Promise((resolve) => {
      initializeFirebase();
      firebase.auth().onAuthStateChanged((user) => {
        commit(MutationTypes.SET_USER, user);
        dispatch(AuthActionTypes.LOAD_PROFILE).then(() => {
          dispatch(PictureActionTypes.LOAD_PICTURES).then(() => {
            resolve();
          });
        });
      });
    });
  },
};
