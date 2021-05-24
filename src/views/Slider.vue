<template>
  <picture-slider class="slider"></picture-slider>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import PictureSlider from "../components/UI/slider/PictureSlider.vue";
export default defineComponent({
  components: {
    PictureSlider,
  },
});
</script>

<style land="scss" scoped>
.slider {
  position: relative;
  margin: auto;
}
</style>
