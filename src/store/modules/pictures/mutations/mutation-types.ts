import { Pictures } from "@/store/types";
import { State } from "../state";

export enum MutationTypes {
  SET_PICTURES = "SET_PICTURES",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_PICTURES](state: S, payload: Pictures | null): void;
};
