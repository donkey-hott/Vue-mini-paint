<template>
  <the-header></the-header>
  <router-view />
</template>

<script lang="ts">
import TheHeader from "./components/UI/TheHeader.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    TheHeader,
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

@media (min-width: 767px) {
  #app {
    font-size: 20px;
  }
}
</style>
