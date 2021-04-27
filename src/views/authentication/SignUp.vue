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
import { useToast } from "vue-toastification";

import BaseAuthentication from "../../components/authentication/BaseAuthentication.vue";

export default defineComponent({
  components: {
    BaseAuthentication,
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    async function signUp(authenticationData: {
      email: string;
      password: string;
    }) {
      try {
        await store.dispatch(ActionTypes.SIGN_UP, authenticationData);
        router.push("/");

        toast.success("Signed up successfully!");
        console.log("User has been signed up");
      } catch (error) {
        toast.error(`Cannot sign up: ${error.message}`);
      }
    }

    return {
      signUp,
    };
  },
});
</script>

<style lang="scss" scoped></style>
