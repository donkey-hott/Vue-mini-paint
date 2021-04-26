import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";

import firebase from "firebase";
import { firebaseConfig } from "../firebaseConfig";

import { store } from "./store";
import { ActionTypes } from "./store/actions/action-types";
import { MutationTypes } from "./store/mutations/mutation-types";

import BaseButton from "./components/UI/BaseButton.vue";

firebase.initializeApp(firebaseConfig);
let app: any;

firebase.auth().onAuthStateChanged((user) => {
  store.commit(MutationTypes.SET_USER, user);
  if (!app) {
    app = createApp(App)
      .use(store)
      .use(router)
      .component("base-button", BaseButton)
      .mount("#app");
  }
  store.dispatch(ActionTypes.LOAD_PICTURES);
});
