<template>
  <div class="tooltip">
    <span class="tooltip__text">Tooltip text</span>
    <div class="tooltip__buttons">
      <button>Previous</button>
      <button>End preview</button>
      <button>Next</button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({});
</script>

<style lang="scss" scoped>
.tooltip {
  padding: 0.3em;
  position: absolute;
  background: #2c343a;
  color: #fff;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s;

  &__text {
    margin-bottom: 0.5em;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    gap: 0.5em;
  }

  &::after {
    content: " ";
    position: absolute;
    top: 50%;
    right: 100%; /* To the left of the tooltip */
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent #2c343a transparent transparent;
  }
}
</style>
