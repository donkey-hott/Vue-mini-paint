<template>
  <pay-pal></pay-pal>
  <paint-canvas></paint-canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PaintCanvas from "../components/PaintCanvas.vue";
import PayPal from "../components/PayPal.vue";

export default defineComponent({
  components: {
    PaintCanvas,
    PayPal,
  },
});
</script>
