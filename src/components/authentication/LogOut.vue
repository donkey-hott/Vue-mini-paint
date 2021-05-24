<template>
  <base-button class="logout-btn" @click="logOut"> Log out </base-button>
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
        store.dispatch(ActionTypes.LOG_OUT, undefined);
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
@import "../../assets/colors.scss";

.logout-btn {
  background: #e72c44;
}
</style>
