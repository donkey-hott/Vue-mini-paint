<template>
  <base-authentication
    cardCaption="Sign in"
    @submit-inputs="signIn"
  ></base-authentication>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { ActionTypes } from "../../store/actions/action-types";
import { useStore } from "../../store";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import BaseAuthentication from "../../components/BaseAuthentication.vue";

export default defineComponent({
  components: {
    BaseAuthentication,
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    async function signIn(authenticationData: {
      email: string;
      password: string;
    }) {
      try {
        await store.dispatch(ActionTypes.SIGN_IN, authenticationData);
        router.push("/");

        toast.success("You have been logged in successfully!");
        console.log("User has been signed in");
      } catch (error) {
        toast.error(`Cannot sign in: ${error.message}`);
        console.error("cannot sign in:", error);
      }
    }

    return {
      signIn,
    };
  },
});
</script>
