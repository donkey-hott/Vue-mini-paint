<template>
  <section class="registration">
    <h2 class="registration__title">New profile</h2>
    <form @submit.prevent="submit" class="form" novalidate>
      <fieldset class="form__personal-infos">
        <legend>Personal information</legend>
        <label for="fullname">
          Full name
          <input v-model="fullname" type="text" id="fullname" />
        </label>
        <span
          style="color: red"
          v-if="v$.fullname.$invalid && v$.fullname.$dirty"
        >
          {{ v$.fullname.$errors[0].$message }}
        </span>
        <label for="birth">
          Birth date
          <input v-model="birthDate" type="date" id="birth" />
        </label>
        <span
          style="color: red"
          v-if="v$.birthDate.$invalid && v$.birthDate.$dirty"
        >
          {{ v$.birthDate.$errors[0].$message }}
        </span>
        <label for="gender">
          Gender
          <select>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label for="bio">
          Bio
          <textarea></textarea>
        </label>
        <label for="avatar">
          Profile image
          <input accept="image/png, image/jpeg" type="file" id="avatar" />
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
            <input type="text" id="company" />
          </label>
          <label for="post">
            Post
            <input type="text" id="post" />
          </label>
          <label for="linkedIn">
            LinkedIn
            <input v-model="linkedInURL" type="url" id="linkedIn" />
          </label>
          <span
            style="color: red"
            v-if="v$.linkedInURL.$invalid && v$.linkedInURL.$dirty"
          >
            {{ v$.linkedInURL.$errors[0].$message }}
          </span>
        </template>
      </fieldset>
      <fieldset class="form__contact-infos">
        <legend>Contact information</legend>
        <label for="email">
          Email
          <input type="email" v-model="email" id="email" />
        </label>
        <span style="color: red" v-if="v$.email.$invalid && v$.email.$dirty">
          {{ v$.email.$errors[0].$message }}
        </span>
        <label for="phone">
          Phone
          <input
            placeholder="In international format"
            v-model="phone"
            type="tel"
            id="phone"
          />
        </label>
        <span
          style="color: red"
          v-if="v$.phone.validPhoneNumber.$invalid && v$.phone.$dirty"
        >
          {{ v$.phone.$errors[0].$message }}
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
import { defineComponent, ref } from "@vue/runtime-core";
import useVuelidate, { ValidatorFn } from "@vuelidate/core";
import {
  required,
  helpers,
  email as emailValidator,
} from "@vuelidate/validators";
import { isValidLinkedInURL, isValidTel } from "../utils/customValidators";
/* TODO: make custom "input[type='file']" */

export default defineComponent({
  components: { BaseButton },
  setup() {
    const hasJob = ref(false);
    const fullname = ref("");
    const birthDate = ref("");
    const email = ref("");
    const phone = ref("");
    const linkedInURL = ref("");

    const validationRules = {
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
    };

    const v$ = useVuelidate(validationRules, {
      fullname,
      birthDate,
      linkedInURL,
      phone,
      email,
    });

    function submit() {
      v$.value.$touch();
      if (v$.value.$invalid) {
        console.info("some fields are invalid");
      }
    }

    return {
      hasJob,
      fullname,
      birthDate,
      linkedInURL,
      phone,
      email,
      v$,
      submit,
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
