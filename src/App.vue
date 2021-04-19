<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/sign-up">Sign up</router-link>
    <button @click="logOut">Log out</button>
  </div>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ActionTypes } from "./store/actions/action-types";
export default defineComponent({
  methods: {
    logOut() {
      this.$store.dispatch(ActionTypes.LOG_OUT);
    },
  },
});
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font-size: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 16px;
}

@media (min-width: 768px) {
  #app {
    font-size: 20px;
  }
}
</style>
