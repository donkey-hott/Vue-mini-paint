import { State } from "@/store/modules/auth/state";
import firebase from "firebase";

export enum MutationTypes {
  SET_USER = "SET_USER",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_USER](state: S, payload: firebase.User | null): void;
};
