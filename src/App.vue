<template>
  <the-header></the-header>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheHeader from "./components/UI/TheHeader.vue";

export default defineComponent({
  components: {
    TheHeader,
  },
});
</script>

<style lang="scss">
@import "../public/styles/typography.scss";
@import "../public/styles/colors.scss";

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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

// select,
// input {
//   font-size: inherit;
//   font-family: inherit;
// }

input {
  border: 0;
}
</style>
