import { UserProfile } from "@/store/types";
import { State } from "../state";

export type Getters = {
  isUserAuthenticated(state: State): boolean;
  userProfile(state: State): UserProfile | null;
};
