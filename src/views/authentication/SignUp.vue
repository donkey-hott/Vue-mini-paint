<template>
  <base-authentication
    cardCaption="Sign up"
    @submit-inputs="signUp"
  ></base-authentication>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { ActionTypes } from "../../store/actions/action-types";
import { useStore } from "../../store";
import { useRouter } from "vue-router";

import BaseAuthentication from "../../components/BaseAuthentication.vue";

export default defineComponent({
  components: {
    BaseAuthentication,
  },

  setup() {
    const store = useStore();
    const router = useRouter();

    async function signUp(authenticationData: {
      email: string;
      password: string;
    }) {
      try {
        await store.dispatch(ActionTypes.SIGN_UP, authenticationData);
        router.push("/");

        console.log("User has been signed up");
      } catch (error) {
        console.error("Cannot sign up:", error);
      }
    }

    return {
      signUp,
    };
  },
});
</script>

<style lang="scss" scoped></style>
