import { State } from "../state";

export type Getters = {
  isUserAuthenticated(state: State): boolean;
};
