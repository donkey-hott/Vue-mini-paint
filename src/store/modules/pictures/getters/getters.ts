import { GetterTree } from "vuex";
import { State as RootState } from "@/store";
import { State } from "../state";
import { Getters } from "./getter-types";

export const getters: GetterTree<State, RootState> & Getters = {
  picturesNumber: (state) => {
    return Object.keys(state.userPictures).length;
  },
};
