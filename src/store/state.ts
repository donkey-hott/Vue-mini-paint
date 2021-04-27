import firebase from "firebase";
import { Pictures } from "./types";

export const state: {
  userPictures: Pictures;
  currentUser: firebase.User | null;
} = {
  userPictures: {},
  currentUser: null,
};

export type State = typeof state;
