<template>
  <main class="registration">
    <h2 class="registration__title">
      {{
        currentRoute === "create-profile" ? "Create profile" : "Edit profile"
      }}
    </h2>
    <form @submit.prevent="submit" class="form" novalidate>
      <fieldset class="form__personal-infos">
        <legend>Personal information</legend>
        <label for="fullname">
          Full name
          <input
            class="truncate"
            v-model="profile.fullname"
            type="text"
            id="fullname"
          />
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
          v-if="
            v$.profile.birthDate.isAdult.$invalid && v$.profile.birthDate.$dirty
          "
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
          <textarea class="truncate" v-model="profile.bio"></textarea>
        </label>
        <label for="avatar">
          Profile image
          <file-input
            accept="image/png, image/jpeg"
            class="file-input"
            @files-loaded="setAvatar"
          ></file-input>
        </label>
      </fieldset>
      <fieldset class="form__job">
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
        <transition>
          <div v-if="hasJob" class="job-infos">
            <label for="company">
              Company
              <input
                class="truncate"
                v-model="profile.company"
                type="text"
                id="company"
              />
            </label>
            <label for="post">
              Post
              <input
                class="truncate"
                v-model="profile.post"
                type="text"
                id="post"
              />
            </label>
            <label for="linkedIn">
              LinkedIn
              <input
                class="truncate"
                v-model="profile.linkedInURL"
                type="url"
                id="linkedIn"
              />
            </label>
            <span
              style="color: red"
              v-if="
                v$.profile.linkedInURL.$invalid && v$.profile.linkedInURL.$dirty
              "
            >
              {{ v$.profile.linkedInURL.$errors[0].$message }}
            </span>
          </div>
        </transition>
      </fieldset>
      <fieldset class="form__contact-infos">
        <legend>Contact information</legend>
        <label for="email">
          Email
          <input
            class="truncate"
            type="email"
            v-model="profile.email"
            id="email"
          />
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
            class="truncate"
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
      <button class="btn btn-primary btn-half-width">Submit</button>
    </form>
  </main>
</template>

<script lang="ts">
import FileInput from "@/components/UI/FileInput.vue";
import { ActionTypes } from "@/store/modules/auth/actions/action-types";
import { UserProfile } from "@/store/types";
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  watch,
  computed,
} from "vue";
import useVuelidate, { ValidatorFn } from "@vuelidate/core";
import {
  required,
  helpers,
  email as emailValidator,
} from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "../store";
import {
  isAdult,
  isValidLinkedInURL,
  isValidTel,
} from "../utils/customValidators";
import { toBase64 } from "../utils/toBase64";

export default defineComponent({
  components: { FileInput },
  setup() {
    const store = useStore();
    const toast = useToast();
    const router = useRouter();
    const currentRoute = ref(router.currentRoute.value.name);
    const hasJob = ref(false);

    let profile = reactive<UserProfile>({
      gender: "male",
      bio: "",
      avatar: null,
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
        birthDate: {
          required,
          isAdult: helpers.withMessage(
            "Age must be over 18",
            isAdult as ValidatorFn
          ),
        },
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

    function readFile(file: File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return reader;
    }

    function setAvatar(files: FileList) {
      const image = files[0];
      const imageAsURL = readFile(image);

      toBase64(imageAsURL).then((base64String) => {
        profile.avatar = base64String;
      });
    }

    function removeJobProperties() {
      /* make a new object without 'company', 'post' and 'linkedInURL' fields */
      const { company, post, linkedInURL, ...unemployedUserProfile } = profile;
      profile = Object.assign({}, unemployedUserProfile);
    }

    async function submit() {
      v$.value.$touch();
      if (v$.value.$invalid) {
        console.info("some fields are invalid");
        return;
      }

      if (!hasJob.value) {
        removeJobProperties();
      }

      try {
        await store.dispatch(ActionTypes.CREATE_PROFILE, profile);
        if (currentRoute.value === "edit-profile") {
          toast.success("Profile is set up!");
        }
        router.push("/");
      } catch (error) {
        console.error(error);
        toast.error(`Cannot set profile up: ${error.message}`);
      }
    }

    const userProfileData = computed(() => {
      return store.getters.userProfile;
    });

    /* Rewrites profile data if page was reloaded */

    watch(userProfileData, (value) => {
      Object.assign(profile, value);
    });

    /* Rewrites profile data if page was entered from other local route */

    onMounted(() => {
      if (currentRoute.value === "edit-profile") {
        Object.assign(profile, userProfileData.value);
      }
    });

    return {
      hasJob,
      profile,
      currentRoute,
      v$,
      /* functions */
      submit,
      setAvatar,
    };
  },
});
</script>

<style lang="scss" scoped>
fieldset,
.job-infos {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  border-radius: 7px;
  margin: 0.5em 0;
  padding: 0.5em;

  legend {
    text-align: left;
    transform: translate(5px);
    padding: 0.3em;
    background: var(--color-accent);
    box-shadow: 0 3px 6px rgb(0 0 0 / 16%), 0 3px 6px rgb(0 0 0 / 23%);
  }

  > label {
    width: 90%;
    margin: 0.5em 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > input,
    textarea,
    select {
      margin-left: 0.5em;
    }

    input,
    .file-input {
      width: 60%;
    }

    .file-input {
      max-width: 60%;
      background: var(--color-accent);
      transition: background 0.3s;
      border-radius: 7px;

      &:hover {
        background: var(--btn-color-active);
      }
    }
  }
}

.registration {
  width: 50%;

  .job-infos {
    width: 90%;

    label {
      width: 100%;
    }
  }

  &__submit {
    input {
      cursor: pointer;
      border-bottom: none;
    }
  }
}

.v-enter-active {
  animation: expand 0.2s ease-in-out;
  transform-origin: top;
}

.v-leave-active {
  animation: expand 0.2s ease-in-out reverse;
  transform-origin: top;
}

.v-move {
  transition: transform 0.2s;
}

@keyframes expand {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
</style>
