import { GetterTree } from "vuex";
import { State as RootState } from "@/store";
import { State } from "../state";
import { Getters } from "./getter-types";

export const getters: GetterTree<State, RootState> & Getters = {
  getRandomPictures: (state: State) => (picsNum: number) => {
    const picturesEntries = Object.entries(state.userPictures);
    return Object.fromEntries(
      picturesEntries.sort(() => 0.5 - Math.random()).slice(0, picsNum)
    );
  },
};
