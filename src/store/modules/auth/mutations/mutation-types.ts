import { State } from "@/store/modules/auth/state";
import { UserProfile } from "@/store/types";
import firebase from "firebase";

export enum MutationTypes {
  SET_USER = "SET_USER",
  SET_PROFILE = "SET_PROFILE",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_USER](state: S, payload: firebase.User | null): void;
  [MutationTypes.SET_PROFILE](state: S, payload: UserProfile): Promise<void>;
};
