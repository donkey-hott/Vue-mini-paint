import { RouteRecordRaw } from "vue-router";

import Home from "../views/Home.vue";
import SignUp from "../views/authentication/SignUp.vue";
import SignIn from "../views/authentication/SignIn.vue";
import Paint from "../views/Paint.vue";
import Registration from "../views/Registration.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUp,
    meta: {
      isPublic: true,
    },
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: SignIn,
    meta: {
      isPublic: true,
    },
  },
  {
    path: "/new-canvas",
    name: "paint",
    component: Paint,
  },
  {
    path: "/create-profile",
    name: "create-profile",
    component: Registration,
  },
  {
    path: "/edit-profile",
    name: "edit-profile",
    component: Registration,
  },
];
