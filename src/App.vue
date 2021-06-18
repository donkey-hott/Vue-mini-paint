<template>
  <the-header></the-header>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import TheHeader from "./components/UI/TheHeader.vue";
import { useTracker } from "./plugins/tracker";

export default defineComponent({
  setup() {
    const router = useRouter();
    const tracker = useTracker();

    router.beforeEach((to, from, next) => {
      tracker.track("ROUTE_CHANGE", {
        route: to.fullPath,
        enteredFrom: from.fullPath,
        exceptions: ["/forbidden"],
      });
      next();
    });
  },
  components: {
    TheHeader,
  },
});
</script>

<style lang="scss">
@import "../public/styles/typography.scss";
@import "../public/styles/colors.scss";
@import "../public/styles/buttons.scss";

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
#app {
  height: 100%;
}

#app {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  border: 0;
}
</style>
