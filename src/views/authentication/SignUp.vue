<template>
  <base-authentication
    cardCaption="Sign up"
    @submit-inputs="signUp"
  ></base-authentication>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { ActionTypes } from "@/store/modules/auth/actions/action-types";
import { useStore } from "../../store";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import BaseAuthentication from "../../components/authentication/BaseAuthentication.vue";
import { UserPlanTypes } from "@/store/types";

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
        const userCredentials = await store.dispatch(
          ActionTypes.SIGN_UP,
          authenticationData
        );
        const email = userCredentials.user?.email;
        const role = router.currentRoute.value.meta.for as string;
        const plan = {
          type: UserPlanTypes.DEFAULT_PLAN,
          price: 0,
        };
        if (!email) return;

        store.dispatch(ActionTypes.CREATE_PROFILE, { email, role, plan });
        toast.success("Signed up successfully!");
        router.push("/");
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
