import { GetterTree } from "vuex";
import { State as RootState } from "@/store";
import { State } from "../state";
import { Getters } from "./getter-types";

export const getters: GetterTree<State, RootState> & Getters = {
  getVersionById: (state) => (versionId) => {
    return state.versions.find((version) => version.versionId === versionId);
  },
};
