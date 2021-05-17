import { Pictures } from "@/store/types";
import { MutationTree } from "vuex";
import { State } from "../state";
import { Mutations, MutationTypes } from "./mutation-types";

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_PICTURES](state, payload: Pictures | null) {
    if (payload === null) {
      return (state.userPictures = {});
    }

    const { userPictures } = state;
    state.userPictures = { ...userPictures, ...payload };
  },
  [MutationTypes.SET_LOADING_STATUS](state, payload: boolean) {
    state.arePicturesLoading = payload;
  },
};
