<template>
  <header class="header">
    <div class="title">
      <h1 class="title__homepage-link">
        <router-link to="/">Paint</router-link>
      </h1>
    </div>
    <nav class="navigation">
      <ul class="list">
        <li>
          <log-out></log-out>
        </li>
        <li>
          <base-button class="list__slider-btn">
            <router-link to="/slider">Slider</router-link>
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
  .list {
    list-style: none;
    display: flex;

    > li {
      margin: 0 0.3em;
    }

    &__slider-btn {
      background: $emphasizing;

      > a {
        color: #fff;
        text-decoration: none;
      }

      .router-link-active {
        text-decoration: underline;
      }
    }
  }
}
</style>
