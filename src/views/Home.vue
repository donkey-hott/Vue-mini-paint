<template>
  <div class="home">
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

<style lang="scss" scoped>
@import "../assets/colors.scss";

.home {
  background: $dark-background;
}
</style>
