<template>
  <header class="header">
    <div class="logo">
      <h1 class="logo__homepage-link">
        <router-link to="/">Paint</router-link>
      </h1>
    </div>
    <nav class="navigation">
      <ul class="navigation__list" v-show="isUserAuthenticated">
        <li class="nav-item">
          <log-out></log-out>
        </li>
        <li class="nav-item">
          <router-link class="nav-item__edit-profile" to="/edit-profile"
            >Edit profile</router-link
          >
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, defineComponent } from "vue";

import LogOut from "../authentication/LogOut.vue";

export default defineComponent({
  components: {
    LogOut,
  },
  setup() {
    const store = useStore();

    const isUserAuthenticated = computed(() => {
      return store.getters.isUserAuthenticated;
    });

    return { isUserAuthenticated };
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

.logo {
  background: var(--color-accent);
  padding: 0.3em;
  border-radius: 13px;

  &__homepage-link a {
    text-decoration: none;
  }
}

.navigation {
  &__list {
    display: flex;
    justify-content: space-between;
    list-style: none;

    .nav-item {
      margin: 0 0.5em;
      display: flex;
      align-items: center;

      a {
        text-decoration: none;
      }
    }
  }
}
</style>
