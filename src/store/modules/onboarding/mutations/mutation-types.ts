import { State } from "../state";

export enum MutationTypes {
  ADD_ELEMENTS = "ADD_ELEMENTS",
}

export type Mutations<S = State> = {
  [MutationTypes.ADD_ELEMENTS](state: S, payload: any): void;
};
