import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import firebase from "firebase";
import { firebaseConfig } from "../firebaseConfig";
import { MutationTypes } from "./store/mutations/mutation-types";
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  createApp(App).use(store).use(router).mount("#app");
  store.commit(MutationTypes.SET_USER, user);
});
