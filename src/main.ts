import axios from "axios";
import { createApp } from "vue";
import router from "./router";
import firebase from "firebase";
import "vue-toastification/dist/index.css";
import Toast from "vue-toastification";

import App from "./App.vue";
import { store } from "./store";
import { RootActions } from "@/store/modules/root/actions/action-types";

import Spinner from "./components/UI/Spinner.vue";
import Tracker from "./plugins/trackerInit";
import { ActionTypes } from "./store/modules/auth/actions/action-types";

let app: any;

store.dispatch(RootActions.INIT).then((user: firebase.User | null) => {
  if (app) return;

  axios.interceptors.request.use(
    async (config) =>
      await store.dispatch(ActionTypes.SET_AUTHORIZATION_HEADER, config)
  );

  app = createApp(App)
    .use(store)
    .use(router)
    .use(Toast)
    .component("spinner", Spinner);

  const userName = store.state.auth.userProfile?.fullname || "";
  const email = user?.email;
  const uid = user?.uid;

  if (user) {
    app.use(Tracker, {
      userInfo: {
        userName,
        uid,
        email,
      },
    });
  }
  app.mount("#app");
});
