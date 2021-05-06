// import { State as RootState } from "@/store";
import firebase from "firebase";

export type State = {
  currentUser: firebase.User | null;
};

export const state: State = {
  currentUser: null,
};
