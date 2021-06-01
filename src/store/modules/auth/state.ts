// import { State as RootState } from "@/store";
import { UserProfile } from "@/store/types";
import firebase from "firebase";

export type State = {
  currentUser: firebase.User | null;
  userProfile: UserProfile | null;
};

export const state: State = {
  currentUser: null,
  userProfile: null,
};
