<template>
  <section class="registration">
    <h2 class="registration__title">New profile</h2>
    <form @submit.prevent="submit" class="form" novalidate>
      <fieldset class="form__personal-infos">
        <legend>Personal information</legend>
        <label for="fullname">
          Full name
          <input v-model="profile.fullname" type="text" id="fullname" />
        </label>
        <span
          style="color: red"
          v-if="v$.profile.fullname.$invalid && v$.profile.fullname.$dirty"
        >
          {{ v$.profile.fullname.$errors[0].$message }}
        </span>
        <label for="birth">
          Birth date
          <input v-model="profile.birthDate" type="date" id="birth" />
        </label>
        <span
          style="color: red"
          v-if="v$.profile.birthDate.$invalid && v$.profile.birthDate.$dirty"
        >
          {{ v$.profile.birthDate.$errors[0].$message }}
        </span>
        <label for="gender">
          Gender
          <select v-model="profile.gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label for="bio">
          Bio
          <textarea v-model="profile.bio"></textarea>
        </label>
        <label for="avatar">
          Profile image
          <input
            type="file"
            accept="image/png, image/jpeg"
            @change="setAvatar($event.target)"
            id="avatar"
          />
        </label>
      </fieldset>
      <fieldset class="form__job-infos">
        <legend>Job information</legend>
        <label for="job">
          Do you have a job?
          <label for="has-job">
            Yes
            <input
              v-model="hasJob"
              :value="true"
              name="job"
              type="radio"
              id="has-job"
            />
          </label>
          <label for="no-job">
            No
            <input
              v-model="hasJob"
              :value="false"
              name="job"
              type="radio"
              id="no-job"
            />
          </label>
        </label>
        <template v-if="hasJob">
          <label for="company">
            Company
            <input v-model="profile.company" type="text" id="company" />
          </label>
          <label for="post">
            Post
            <input v-model="profile.post" type="text" id="post" />
          </label>
          <label for="linkedIn">
            LinkedIn
            <input v-model="profile.linkedInURL" type="url" id="linkedIn" />
          </label>
          <span
            style="color: red"
            v-if="
              v$.profile.linkedInURL.$invalid && v$.profile.linkedInURL.$dirty
            "
          >
            {{ v$.profile.linkedInURL.$errors[0].$message }}
          </span>
        </template>
      </fieldset>
      <fieldset class="form__contact-infos">
        <legend>Contact information</legend>
        <label for="email">
          Email
          <input type="email" v-model="profile.email" id="email" />
        </label>
        <span
          style="color: red"
          v-if="v$.profile.email.$invalid && v$.profile.email.$dirty"
        >
          {{ v$.profile.email.$errors[0].$message }}
        </span>
        <label for="phone">
          Phone
          <input
            placeholder="In international format"
            v-model="profile.phone"
            type="tel"
            id="phone"
          />
        </label>
        <span
          style="color: red"
          v-if="
            v$.profile.phone.validPhoneNumber.$invalid &&
            v$.profile.phone.$dirty
          "
        >
          {{ v$.profile.phone.$errors[0].$message }}
        </span>
      </fieldset>
      <base-button class="registration__submit">
        <label for="submit-form">
          <input type="submit" value="Submit" />
        </label>
      </base-button>
    </form>
  </section>
</template>

<script lang="ts">
import BaseButton from "@/components/UI/BaseButton.vue";
import { ActionTypes } from "@/store/modules/auth/actions/action-types";
import { UserProfile } from "@/store/types";
import { defineComponent, onMounted, ref } from "@vue/runtime-core";
import useVuelidate, { ValidatorFn } from "@vuelidate/core";
import {
  required,
  helpers,
  email as emailValidator,
} from "@vuelidate/validators";
import { reactive } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "../store";
import { isValidLinkedInURL, isValidTel } from "../utils/customValidators";
/* TODO: make custom "input[type='file']" */

export default defineComponent({
  components: { BaseButton },
  setup() {
    const store = useStore();
    const toast = useToast();
    const route = useRoute();
    const hasJob = ref(false);

    let profile = reactive<UserProfile>({
      gender: "male",
      bio: "",
      avatar: undefined,
      company: "",
      post: "",
      /* fields to be validated */
      fullname: "",
      birthDate: "",
      linkedInURL: "",
      email: "",
      phone: "",
    });

    const validationRules = {
      profile: {
        fullname: { required },
        birthDate: { required },
        linkedInURL: {
          validLinkedInURL: helpers.withMessage(
            "Input is not a valid LinkedIn profile link",
            isValidLinkedInURL as ValidatorFn
          ),
        },
        phone: {
          required,
          validPhoneNumber: helpers.withMessage(
            "Phone number must be in international format",
            isValidTel as ValidatorFn
          ),
        },
        email: {
          required,
          emailValidator,
        },
      },
    };

    const v$ = useVuelidate(validationRules, { profile });

    function setAvatar(inputEl: HTMLInputElement) {
      if (inputEl.files === null) return;

      profile.avatar = inputEl.files[0];
    }

    async function submit() {
      v$.value.$touch();
      if (v$.value.$invalid) {
        console.info("some fields are invalid");
        return;
      }

      try {
        await store.dispatch(ActionTypes.CREATE_PROFILE, profile);
        toast.success("Profile updated");
      } catch (error) {
        toast.error(`Cannot create profile: ${error.message}`);
      }
    }

    onMounted(() => {
      if (route.name === "edit-profile") {
        /* TODO: FIX A BUG WITH UNNECESSARY PARAMETER IN STORE  */
        /* TODO: in "LOAD_PROFILE" function replace 'return' with 'reject' */
        store.dispatch(ActionTypes.LOAD_PROFILE, undefined)?.then((value) => {
          Object.assign(profile, value);
        });
      }
    });

    return {
      hasJob,
      profile,
      v$,
      /* functions */
      submit,
      setAvatar,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/colors.scss";

.registration {
  fieldset {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: $light-background;
    border: none;
    border-radius: 7px;
    margin: 0.5em 0;

    legend {
      text-align: left;
      transform: translate(5px);
      padding: 0 0.3em;
      background: $emphasizing;
      box-shadow: 0 3px 6px rgb(0 0 0 / 16%), 0 3px 6px rgb(0 0 0 / 23%);
    }

    > label {
      width: 70%;
      margin: 0.5em 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      > input,
      textarea,
      select {
        border-bottom: 2px solid $emphasizing;
        margin-left: 0.5em;
      }

      input {
        width: 65%;
      }
    }
  }
  &__submit {
    background: $emphasizing;
    width: 50%;

    input {
      cursor: pointer;
    }
  }
}
</style>
