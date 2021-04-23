import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import SignUp from "../views/authentication/SignUp.vue";
import SignIn from "../views/authentication/SignIn.vue";
import Paint from "../views/Paint.vue";
import { store } from "../store";

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
  {
    path: "/new-canvas",
    name: "paint",
    component: Paint,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some((record) => record.meta.isPublic);
  const currentUser = store.state.currentUser;

  console.log("Current user from router:", currentUser);

  if (!currentUser && !isPublic) {
    return next("/sign-in");
  }
  next();
});

export default router;
