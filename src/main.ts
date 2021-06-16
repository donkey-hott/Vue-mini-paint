import { createApp, ComponentPublicInstance } from "vue";
import App from "./App.vue";

import router from "./router";

import { store } from "./store";
import { RootActions } from "@/store/modules/root/actions/action-types";

import Toast from "vue-toastification";
import Spinner from "./components/UI/Spinner.vue";
import "vue-toastification/dist/index.css";
import Tracker from "./plugins/tracker";

let app: ComponentPublicInstance;

store.dispatch(RootActions.INIT).then(() => {
  if (!app) {
    app = createApp(App)
      .use(store)
      .use(router)
      .use(Toast)
      .use(Tracker)
      .component("spinner", Spinner)
      .mount("#app");
  }
});
