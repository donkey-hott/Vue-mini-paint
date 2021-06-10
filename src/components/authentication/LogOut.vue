<template>
  <button class="btn btn-secondary" @click="logOut">Log out</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import { useStore } from "../../store";

import { useToast } from "vue-toastification";
import { ActionTypes } from "@/store/modules/auth/actions/action-types";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    async function logOut() {
      try {
        store.dispatch(ActionTypes.LOG_OUT);
        router.push("sign-in");
      } catch (error) {
        toast.error(`Cannot log out: ${error.message}`);
      }
    }

    return {
      logOut,
    };
  },
});
</script>

<style lang="scss" scoped>
button {
  color: var(--color-danger);
  transition: all 0.3s;

  &:hover {
    border-color: var(--color-danger);
  }
}
</style>
