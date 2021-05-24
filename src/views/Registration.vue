<template>
  <section class="registration">
    <h2 class="registration__title">New profile</h2>
    <form class="form">
      <fieldset class="form__personal-infos">
        <legend>Personal information</legend>
        <label for="fullname">
          Full name
          <input type="text" id="fullname" />
        </label>
        <label for="birth">
          Birth date
          <input type="date" id="birth" />
        </label>
        <label for="gender">
          Gender
          <select>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="male">Male</option>
          </select>
        </label>
        <label for="bio">
          Bio
          <textarea></textarea>
        </label>
        <label for="avatar">
          Profile image
          <input type="file" id="avatar" />
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
            <input type="url" id="linkedIn" />
          </label>
        </template>
      </fieldset>
      <fieldset class="form__contact-infos">
        <legend>Contact information</legend>
        <label for="email">
          Email
          <input type="email" id="email" />
        </label>
        <label for="phone">
          Phone
          <input type="tel" id="phone" />
        </label>
      </fieldset>
      <base-button class="registration__submit">
        <label for="submit-form">
          <input type="submit" value="Submit" />
        </label>
      </base-button>
    </form>
  </section>
</template>

<script>
import BaseButton from "@/components/UI/BaseButton.vue";
import { defineComponent, ref } from "@vue/runtime-core";
/* TODO: make custom "input[type='file']" */

export default defineComponent({
  components: { BaseButton },
  setup() {
    const hasJob = ref(false);

    return {
      hasJob,
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
