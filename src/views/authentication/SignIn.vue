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
    {{ refs }}
  </base-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ActionTypes } from "../../store/actions/action-types";
import BaseCard from "../../components/UI/BaseCard.vue";

export default defineComponent({
  components: {
    BaseCard,
  },
  data() {
    return {
      email: "",
      password: "",
      isPasswordShown: false,
    };
  },
  methods: {
    async signIn() {
      try {
        await this.$store.dispatch(ActionTypes.SIGN_IN, {
          email: this.email,
          password: this.password,
        });
        this.$router.push("/");
        console.log("User has been signed in");
      } catch (error) {
        console.error("cannot sign in:", error);
      }
    },
  },
  watch: {
    isPasswordShown(isPasswordShown: boolean) {
      const passwordField = this.$refs.passField as HTMLInputElement;
      passwordField.value = isPasswordShown ? "text" : "password";
    },
  },
});
</script>
