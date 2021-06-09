<template>
  <the-header></the-header>
  <router-view />
  <onboarding v-if="showOnboarding"></onboarding>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import TheHeader from "./components/UI/TheHeader.vue";
import Onboarding from "./components/Onboarding.vue";
import { useStore } from "@/store";

export default defineComponent({
  components: {
    TheHeader,
    Onboarding,
  },

  setup() {
    const store = useStore();
    const showOnboarding = computed(
      () => store.state.onboarding.showOnboarding
    );

    return {
      showOnboarding,
    };
  },
});
</script>

<style lang="scss">
@import "./assets/colors.scss";

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font-size: 100%;
}
html,
body,
#app {
  height: 100%;
}

#app {
  font-family: "Nunito Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $dark-contrast;
  background: $dark-background;
  font-size: 16px;
}

select,
input {
  font-size: inherit;
  font-family: inherit;
}

input {
  background: transparent;
  border: 0;
  color: #fff;
}

/* class that highlights elements during the onboarding guide */
.highlighted-element {
  position: relative;
  z-index: 20;
}

@media (min-width: 767px) {
  #app {
    font-size: 20px;
  }
}
</style>
