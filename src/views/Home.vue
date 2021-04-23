<template>
  <div class="home">
    <p>You have been authenticated!</p>
    <router-link to="/new-canvas">Create new picture</router-link>
    <picture-gallery></picture-gallery>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PictureGallery from "../components/PictureGallery.vue";

export default defineComponent({
  name: "Home",
  components: {
    PictureGallery,
  },
});
</script>
