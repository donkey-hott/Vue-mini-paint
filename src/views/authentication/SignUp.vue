<template>
  <base-card>
    <template v-slot:title>
      <h2>Sign up</h2>
    </template>
    <template v-slot:inputs>
      <label for="email">Email</label>
      <input v-model="email" type="email" id="email" />
      <label for="password">Password</label>
      <input v-model="password" type="password" id="password" ref="passField" />
      <label for="show-password">Show password</label>
      <input v-model="isPasswordShown" type="checkbox" id="show-password" />
    </template>
    <template v-slot:submit-btn>
      <button @click="signUp">Sign up</button>
    </template>
    <template v-slot:change-action>
      Have an account? <router-link to="/sign-in">Sign in</router-link>
    </template>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import { ActionTypes } from "../../store/actions/action-types";
import { useStore } from "../../store";
import { useRouter } from "vue-router";

import BaseCard from "../../components/UI/BaseCard.vue";

export default defineComponent({
  components: {
    BaseCard,
  },

  setup() {
    const email = ref<string>("");
    const password = ref<string>("");
    const isPasswordShown = ref<boolean>(false);
    const passField = ref<HTMLInputElement | null>(null);

    const store = useStore();
    const router = useRouter();

    async function signUp() {
      try {
        await store.dispatch(ActionTypes.SIGN_UP, {
          email: email.value,
          password: password.value,
        });

        router.push("/");
        console.log("User has been signed up");
      } catch (error) {
        console.error("Cannot sign up:", error);
      }
    }

    watch(isPasswordShown, () => {
      if (!passField.value) return;

      passField.value.type = isPasswordShown.value ? "text" : "password";
    });

    return {
      email,
      password,
      isPasswordShown,
      passField,
      signUp,
    };
  },
});
</script>
<style></style>
