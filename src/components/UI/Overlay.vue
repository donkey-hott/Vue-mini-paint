<template>
  <transition>
    <div v-if="show" class="overlay"></div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  opacity: 0;
  z-index: 10;
  pointer-events: all;
  opacity: 1;
  cursor: default;
}

.v-enter-active {
  animation: fade-out 0.2s;
}

.v-leave-active {
  animation: fade-out 0.3s reverse;
}

@keyframes fade-out {
  from {
    pointer-events: none;
    opacity: 0;
  }
}
</style>
