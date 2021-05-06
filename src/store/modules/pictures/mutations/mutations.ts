import { Pictures } from "@/store/types";
import { MutationTree } from "vuex";
import { State } from "../state";
import { Mutations, MutationTypes } from "./mutation-types";

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_PICTURES](state, payload: Pictures) {
    state.userPictures = payload;
  },
};
