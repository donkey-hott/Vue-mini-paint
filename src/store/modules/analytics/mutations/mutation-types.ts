import { State } from "../state";

export enum MutationTypes {
  SET_VISITS_BY_TIME = "SET_VISITS_BY_TIME",
  SET_VISITS_BY_PAGES = "SET_VISITS_BY_PAGES",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_VISITS_BY_TIME](
    state: S,
    payload: {
      [key: string]: number;
    }
  ): void;
  [MutationTypes.SET_VISITS_BY_PAGES](
    state: S,
    payload: {
      [key: string]: number;
    }
  ): void;
};
