import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";

import { store } from "./store";
import { ActionTypes } from "./store/actions/action-types";

import BaseButton from "./components/UI/BaseButton.vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

let app: any;

store.dispatch(ActionTypes.INIT).then(() => {
  if (!app) {
    app = createApp(App)
      .use(store)
      .use(router)
      .use(Toast)
      .component("base-button", BaseButton)
      .mount("#app");
  }
});
