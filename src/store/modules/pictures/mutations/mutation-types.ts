import { Pictures } from "@/store/types";
import { State } from "../state";

export enum MutationTypes {
  SET_PICTURES = "SET_PICTURES",
  SET_LOADING_STATUS = "SET_LOADING_STATUS",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_PICTURES](state: S, payload: Pictures): void;
  [MutationTypes.SET_LOADING_STATUS](state: S, payload: boolean): void;
};
