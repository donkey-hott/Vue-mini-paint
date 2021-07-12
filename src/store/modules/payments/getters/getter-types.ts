import { State } from "../state";

export type Getters = {
  isUserPremium(state: State): boolean;
  isDefaultUser(state: State): boolean;
};
