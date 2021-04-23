<template>
  <button v-show="isUserAuthenticated" @click="logOut" class="logout-btn">
    Log out
  </button>
  <div>{{ isUserAuthenticated }}</div>
</template>

<script lang="ts">
import { defineComponent, ComputedRef, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "../store";
import { ActionTypes } from "../store/actions/action-types";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const isUserAuthenticated: ComputedRef<boolean> = computed(() => {
      return store.state.currentUser !== null;
    });

    function logOut() {
      store.dispatch(ActionTypes.LOG_OUT);
      router.push("sign-in");
    }

    return {
      logOut,
      isUserAuthenticated,
    };
  },
});
</script>
