<template>
  <form class="card" autocomplete="off" @submit.prevent="submitInputs">
    <h2 class="card__title">{{ cardCaption }}</h2>
    <div class="grid-inputs">
      <div class="grid-inputs__group">
        <label for="email">Email</label>
        <input placeholder="Email..." v-model="email" type="email" id="email" />
      </div>
      <div class="grid-inputs__group">
        <label for="password">Password</label>
        <input
          placeholder="Password..."
          v-model="password"
          type="password"
          id="password"
          ref="passField"
        />
      </div>
      <div class="grid-inputs__group">
        <label for="show-password">Show password</label>
        <input v-model="isPasswordShown" type="checkbox" id="show-password" />
      </div>
      <div class="grid-inputs__submit">
        <base-button>{{ cardCaption }}</base-button>
      </div>
    </div>
    <p class="card__action-changer">
      <span>or</span>
      <router-link :to="oppositeAuthAction.link">{{
        oppositeAuthAction.name
      }}</router-link>
    </p>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";

export default defineComponent({
  emits: ["submit-inputs"],
  props: {
    cardCaption: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    const email = ref<string>("");
    const password = ref<string>("");

    const isPasswordShown = ref<boolean>(false);
    const passField = ref<HTMLInputElement | null>(null);

    function submitInputs() {
      const authenticationData = {
        email: email.value,
        password: password.value,
      };
      emit("submit-inputs", authenticationData);
    }

    watch(isPasswordShown, () => {
      if (!passField.value) return;

      passField.value.type = isPasswordShown.value ? "text" : "password";
    });

    const oppositeActions = {
      "Sign up": {
        link: "/sign-in",
        name: "Sign in",
      },
      "Sign in": {
        link: "/sign-up",
        name: "Sign up",
      },
    };

    const oppositeAuthAction = computed(() => {
      if (
        Object.prototype.hasOwnProperty.call(oppositeActions, props.cardCaption)
      ) {
        return oppositeActions[
          props.cardCaption as keyof typeof oppositeActions
        ];
      }
      /* return data for signing up to avoid empty caption */
      return { link: "/sign-up", name: "Sign up" };
    });

    return {
      password,
      email,
      isPasswordShown,
      passField,
      oppositeAuthAction,
      submitInputs,
    };
  },
});
</script>

<style lang="scss" scoped>
.card {
  width: max-content;
  padding: 1.5em;
  border-radius: 15px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-secondary);

  &__action-changer {
    display: flex;
    flex-direction: column;
    margin-top: 0.5em;
  }

  .grid-inputs {
    display: grid;
    grid-template-rows: 1fr 1fr auto auto;
    gap: 1em;

    &__group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      & > input[type="email"],
      input[type="password"],
      input[type="text"] {
        height: 2em;
        padding: 0.5em;
        margin-top: 0.5em;
      }
    }

    // for "show-password" input group
    &__group:nth-child(3) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    &__submit > button {
      width: 100%;
    }
  }
}
</style>
