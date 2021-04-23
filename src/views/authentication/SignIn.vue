<template>
  <base-card>
    <template v-slot:title>
      <h2>Sign in</h2>
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
      <button @click="signIn">Sign in</button>
    </template>
    <template v-slot:change-action>
      Don't have an account? <router-link to="/sign-up">Sign up</router-link>
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

    async function signIn() {
      try {
        await store.dispatch(ActionTypes.SIGN_IN, {
          email: email.value,
          password: password.value,
        });
        router.push("/");
        console.log("User has been signed in");
      } catch (error) {
        console.error("cannot sign in:", error);
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
      signIn,
    };
  },
});
</script>
