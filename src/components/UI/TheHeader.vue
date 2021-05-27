<template>
  <header class="header">
    <div class="title">
      <h1 class="title__homepage-link">
        <router-link to="/">Paint</router-link>
      </h1>
    </div>
    <nav class="navigation">
      <ul class="navigation__list">
        <li class="nav-item">
          <log-out></log-out>
        </li>
        <li class="nav-item">
          <base-button class="nav-item__edit-profile">
            <router-link to="/edit-profile">Edit profile</router-link>
          </base-button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import LogOut from "../authentication/LogOut.vue";

export default defineComponent({
  components: {
    LogOut,
  },
});
</script>

<style lang="scss" scoped>
@import "../../assets/colors.scss";

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
    display: flex;
    justify-content: space-between;
    list-style: none;

    > .nav-item {
      margin: 0 0.5em;

      > .nav-item__edit-profile {
        background: $emphasizing;

        a {
          text-decoration: none;
          color: #fff;
        }
      }
    }
  }
}
</style>
