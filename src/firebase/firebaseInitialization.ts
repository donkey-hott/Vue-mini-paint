import firebase from "firebase";
import { firebaseConfig } from "./firebaseConfig";

export function initializeFirebase(): void {
  firebase.initializeApp(firebaseConfig);
}
