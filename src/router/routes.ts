import { RouteRecordRaw } from "vue-router";

import Home from "../views/Home.vue";
import SignUp from "../views/authentication/SignUp.vue";
import SignIn from "../views/authentication/SignIn.vue";
import Paint from "../views/Paint.vue";
import Registration from "../views/Registration.vue";
import Swiper from "../views/Swiper.vue";
import ManagePictures from "../views/ManagePictures.vue";
import Page403 from "../views/Page403.vue";
import Charts from "../views/Charts.vue";

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
      forbiddenForAuthenticated: true,
      for: "user",
    },
  },
  {
    path: "/admin-signup",
    name: "admin-signup",
    component: SignUp,
    meta: {
      forbiddenForAuthenticated: true,
      for: "admin",
    },
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: SignIn,
    meta: {
      forbiddenForAuthenticated: true,
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
  {
    path: "/swiper",
    name: "swiper",
    component: Swiper,
    meta: {
      isPublic: true,
    },
  },
  {
    path: "/manage-pictures",
    name: "manage-pictures",
    component: ManagePictures,
    meta: {
      adminOnly: true,
    },
  },
  {
    path: "/analytics",
    name: "analytics",
    component: Charts,
  },
  {
    path: "/forbidden",
    name: "403-forbidden",
    component: Page403,
  },
];
