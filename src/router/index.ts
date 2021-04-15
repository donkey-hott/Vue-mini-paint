import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import SignUp from "../views/authentication/SignUp.vue";
import SignIn from "../views/authentication/SignIn.vue";
// import { store } from "../store";
import firebase from "firebase";
// import { MutationTypes } from "@/store/mutations/mutation-types";

const routes: Array<RouteRecordRaw> = [
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some((record) => record.meta.isPublic);
  const currentUser = firebase.auth().currentUser;
  console.log(currentUser);

  if (!currentUser && !isPublic) {
    return next("/sign-in");
  }
  next();
});

export default router;
