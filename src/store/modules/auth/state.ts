import { UserProfile } from "@/store/types";
import firebase from "firebase";

export type State = {
  currentUser: firebase.User | null;
  userProfile: UserProfile | null;
  plan: string | null;
};

export const state: State = {
  currentUser: null,
  userProfile: null,
  plan: null,
};
