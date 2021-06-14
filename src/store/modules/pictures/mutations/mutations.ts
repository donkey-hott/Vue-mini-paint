import { Pictures } from "@/store/types";
import { MutationTree } from "vuex";
import { State } from "../state";
import { Mutations, MutationTypes } from "./mutation-types";

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_PICTURES](state, payload: Pictures) {
    state.userPictures = payload;
  },
  [MutationTypes.SET_PUBLIC_PICTURES](state, payload) {
    state.publicPictures = payload;
  },
  [MutationTypes.UPDATE_PUBLIC_PICTURE_URL](state, payload) {
    state.publicPictures[payload.id] = payload.url;
  },
  [MutationTypes.REMOVE_PUBLIC_PICTURE](state, payload) {
    const { [payload]: removedValue, ...updatedObject } = state.publicPictures;
    state.publicPictures = updatedObject;
  },
};
