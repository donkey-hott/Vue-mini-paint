<template>
  <main class="home">
    <picture-gallery></picture-gallery>
  </main>
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
