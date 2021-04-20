import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import firebase from "firebase";
import { firebaseConfig } from "../firebaseConfig";
import { ActionTypes } from "./store/actions/action-types";
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(() => {
  createApp(App).use(store).use(router).mount("#app");
  store.dispatch(ActionTypes.LOAD_PICTURES);
});
