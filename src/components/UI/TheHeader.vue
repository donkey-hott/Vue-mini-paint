<template>
  <header class="header">
    <div class="logo">
      <h1 class="logo__homepage-link">
        <router-link to="/">Paint</router-link>
      </h1>
    </div>
    <nav class="navigation">
      <ul class="navigation__list" v-show="isUserAuthenticated">
        <li>
          <span>{{ userProfile?.email }}</span>
        </li>
        <li>
          <div @click="toggleMenu()" class="image-wrapper">
            <img :src="userProfile?.avatar" alt="Picture of current user" />
          </div>
          <transition v-show="isMenuShown">
            <ul @click="toggleMenu(false)" class="menu">
              <li>
                <router-link to="/edit-profile">Edit profile</router-link>
              </li>
              <li>
                <log-out></log-out>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, defineComponent, ref } from "vue";

import LogOut from "../authentication/LogOut.vue";

export default defineComponent({
  components: {
    LogOut,
  },
  setup() {
    const store = useStore();
    const isMenuShown = ref(false);

    const isUserAuthenticated = computed(() => {
      return store.getters.isUserAuthenticated;
    });

    const userProfile = computed(() => {
      return store.state.auth.userProfile;
    });

    function toggleMenu(state?: boolean) {
      console.log(state);
      isMenuShown.value = state || !isMenuShown.value;
    }

    return {
      isUserAuthenticated,
      isMenuShown,
      userProfile,
      toggleMenu,
    };
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

    > li {
      position: relative;
      margin: 0 0.5em;
      display: flex;
      align-items: center;

      a {
        text-decoration: none;
      }

      ul {
        position: absolute;
        top: 100%;
        right: 50%;
        width: max-content;
        padding: 0.5em;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        background: var(--bg-secondary);
        border-radius: 7px;
        z-index: 30;

        > li {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .image-wrapper {
        width: 50px;
        height: 50px;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          user-select: none;
        }
      }
    }
  }
}

.v-enter-active {
  animation: expand 0.2s ease-in-out;
  transform-origin: top;
}

.v-leave-active {
  animation: expand 0.2s ease-in-out reverse;
  transform-origin: top;
}

.v-move {
  transition: transform 0.2s;
}

@keyframes expand {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
</style>
