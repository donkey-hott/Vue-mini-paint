<template>
  <header class="header">
    <div class="title">
      <h1 class="title__homepage-link">
        <router-link to="/">Paint</router-link>
      </h1>
    </div>
    <nav class="navigation">
      <ul class="navigation__list">
        <li>
          <log-out></log-out>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import LogOut from "../LogOut.vue";

export default defineComponent({
  components: {
    LogOut,
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  margin: 0 auto;
  padding: 0.5em 0;
}

.title {
  &__homepage-link > a {
    font-size: 2em;
    text-decoration: none;
    color: #fff;
  }
}

.navigation {
  &__list {
    list-style: none;
  }
}
</style>