import { State } from "../state";
import { Actions, ActionTypes } from "./action-types";
import firebase from "firebase";
import { ActionTree } from "vuex";
import { DbRecord } from "@/utils/createDbRecord";
import { Pictures } from "@/store/types";
import { MutationTypes } from "../mutations/mutation-types";
import { State as RootState } from "@/store";

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.SAVE_PICTURE](context, payload: DbRecord | undefined) {
    const currentUser: firebase.User | null =
      context.rootState.auth.currentUser;
    if (!payload || !currentUser) return;

    await firebase
      .database()
      .ref(currentUser?.uid)
      .child("pictures")
      .push(payload);
  },
  async [ActionTypes.LOAD_PICTURES](context, selectionBounds) {
    const { currentUser } = context.rootState.auth;
    const { start, end } = selectionBounds;

    if (!currentUser) return;

    try {
      await firebase
        .database()
        .ref(currentUser.uid)
        .child("pictures")
        .orderByChild("date")
        .startAt(start)
        .limitToFirst(end)
        .on("value", (snapshot) => {
          let pictures: Pictures = snapshot.val();
          if (pictures === null) pictures = {};
          context.commit(MutationTypes.SET_PICTURES, pictures);
          console.log(
            "%cPictures have been loaded!",
            "color:#67FF3D",
            pictures
          );
        });
    } catch (error) {
      console.error(error);
    }
  },
};
