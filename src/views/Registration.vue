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
      </fieldset>
      <fieldset class="form__job-infos">
        <legend>Job information</legend>
        <label for="job">
          Do you have a job?
          <label for="has-job">
            Yes
            <input name="job" type="radio" id="has-job" />
          </label>
          <label for="no-job">
            No
            <input name="job" type="radio" id="no-job" />
          </label>
        </label>
      </fieldset>
      <fieldset class="form__contact-infos">
        <legend>Contact information</legend>
        <label for="email">
          Email
          <input type="email" id="email" />
        </label>
        <label for="phone">
          Phone number
          <input type="tel" id="phone" />
        </label>
        <label for="avatar">
          Choose your profile image
          <input type="file" id="avatar" />
        </label>
      </fieldset>
      <label for="submit-form">
        <input type="submit" value="Submit" />
      </label>
    </form>
  </section>
</template>

<script>
export default {};
</script>

<style></style>
