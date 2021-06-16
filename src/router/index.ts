import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { store } from "../store";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some((record) => record.meta.isPublic);
  const isForAdmin = to.matched.some((record) => record.meta.adminOnly);
  const forbiddenForAuthenticated = to.matched.some(
    (record) => record.meta.forbiddenForAuthenticated
  );
  const currentUser = store.state.auth.currentUser;
  const userProfile = store.getters.userProfile;

  if (!currentUser && !isPublic && !forbiddenForAuthenticated) {
    return next("/sign-in");
  }

  /* Prevent authenticated user from entering
    authentication pages */
  if (currentUser && forbiddenForAuthenticated) {
    return next("/");
  }

  if (isForAdmin && userProfile.role !== "admin") {
    return next("/forbidden");
  }
  next();
});

export default router;
