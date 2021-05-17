<template>
  <base-button class="logout-btn" v-show="isUserAuthenticated" @click="logOut">
    Log out
  </base-button>
</template>

<script lang="ts">
import { defineComponent, ComputedRef, computed } from "vue";
import { useRouter } from "vue-router";

import { useStore } from "../../store";

import { useToast } from "vue-toastification";
import { ActionTypes } from "@/store/modules/auth/actions/action-types";
import { MutationTypes } from "@/store/modules/pictures/mutations/mutation-types";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const isUserAuthenticated: ComputedRef<boolean> = computed(() => {
      return store.getters.isUserAuthenticated;
    });

    async function logOut() {
      try {
        store.dispatch(ActionTypes.LOG_OUT, undefined);
        store.commit(MutationTypes.SET_PICTURES, null);
        router.push("sign-in");
      } catch (error) {
        toast.error(`Cannot log out: ${error.message}`);
      }
    }

    return {
      logOut,
      isUserAuthenticated,
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
