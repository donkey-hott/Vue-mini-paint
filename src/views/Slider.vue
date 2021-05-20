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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
