<template>
  <the-header></the-header>
  <transition>
    <router-view />
  </transition>
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
  display: flex;
  flex-direction: column;
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

.v-enter-active {
  animation: reduce 0.3s;
}

.v-leave-active {
  animation: reduce 0.3s reverse;
  position: absolute;
}

@keyframes reduce {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
