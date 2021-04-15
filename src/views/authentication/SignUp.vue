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
import { defineComponent } from "vue";
import { ActionTypes } from "../../store/actions/action-types";
import BaseCard from "../../components/UI/BaseCard.vue";

// TODO: UNITE SIGNIN AND SIGNUP COMPONENTS;
// TODO: FIX SHOW PASSWORD FUNC;

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
    async signUp() {
      try {
        await this.$store.dispatch(ActionTypes.SIGN_UP, {
          email: this.email,
          password: this.password,
        });
        this.$router.push("/");
        console.log("User has been signed up");
      } catch (error) {
        console.error("Cannot sign up:", error);
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

<style></style>
