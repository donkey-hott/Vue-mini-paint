<template>
  <paint-canvas></paint-canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PaintCanvas from "../components/PaintCanvas.vue";

export default defineComponent({
  components: {
    PaintCanvas,
  },
});
</script>
