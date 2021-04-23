import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import firebase from "firebase";
import { firebaseConfig } from "../firebaseConfig";

import { ActionTypes } from "./store/actions/action-types";
import { MutationTypes } from "./store/mutations/mutation-types";
firebase.initializeApp(firebaseConfig);
let app: any;

firebase.auth().onAuthStateChanged((user) => {
  store.commit(MutationTypes.SET_USER, user);
  if (!app) {
    app = createApp(App).use(store).use(router).mount("#app");
  }
  // console.log(user);
  store.dispatch(ActionTypes.LOAD_PICTURES);
});
