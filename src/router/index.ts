import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { store } from "../store";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, _, next) => {
  const isPublic = to.matched.some((record) => record.meta.isPublic);
  const currentUser = store.state.auth.currentUser;

  if (!currentUser && !isPublic) {
    return next("/sign-in");
  }

  /* Prevent authenticated user from entering
    authentication pages */
  if (currentUser && isPublic) {
    return next("/");
  }
  next();
});

export default router;
