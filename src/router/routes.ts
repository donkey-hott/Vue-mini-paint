import { RouteRecordRaw } from "vue-router";

import Home from "../views/Home.vue";
import SignUp from "../views/authentication/SignUp.vue";
import SignIn from "../views/authentication/SignIn.vue";
import Paint from "../views/Paint.vue";
import Registration from "../views/Registration.vue";
import Swiper from "../views/Swiper.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { roles: ["user", "admin"] },
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
    meta: { roles: ["user", "admin"] },
  },
  {
    path: "/create-profile",
    name: "create-profile",
    component: Registration,
    meta: {
      roles: ["user", "admin"],
    },
  },
  {
    path: "/edit-profile",
    name: "edit-profile",
    component: Registration,
    meta: {
      roles: ["user", "admin"],
    },
  },
  {
    path: "/swiper",
    name: "swiper",
    component: Swiper,
    meta: {
      roles: ["user", "admin", "visitor"],
    },
  },
];
