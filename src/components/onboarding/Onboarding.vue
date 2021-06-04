<template>
  <div
    :style="`left: ${tooltipPosition.left}px; top: ${tooltipPosition.top}px;`"
    ref="tooltipElement"
    class="tooltip"
  >
    <span class="tooltip__text">{{ currentStep?.textContent }}</span>
    <div class="tooltip__buttons">
      <button @click="decrementStep">Previous</button>
      <button>End preview</button>
      <button @click="showNextPage">Next</button>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const tooltipElement = ref<HTMLElement | null>(null);
    const stepIndex = ref(0);
    const steps = computed(() => {
      return store.state.onboarding.config;
    });
    const tooltipPosition = computed(() => {
      const position = {
        left: 0,
        top: 0,
      };
      const element = currentStep.value?.element;
      if (!element || !tooltipElement.value) return position;
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = element;

      position.left = offsetLeft + offsetWidth + 10;
      position.top = offsetTop + offsetHeight / 3;

      scrollToElement(position.top);
      return position;
    });

    const currentStep = computed(() => {
      return steps.value[stepIndex.value];
    });

    function scrollToElement(position: number) {
      if (!tooltipElement.value) return;

      window.scroll({
        top: position,
        behavior: "smooth",
      });
    }

    function showNextPage() {
      const route = currentStep.value.nextRoute;
      if (!route) return;

      router.push(route).then(() => {
        incrementStep();
      });
    }

    function incrementStep() {
      if (steps.value.length - 1 === stepIndex.value) return;
      stepIndex.value += 1;
    }

    return {
      tooltipElement,
      tooltipPosition,
      showNextPage,
      currentStep,
    };
  },
});
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
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent #2c343a transparent transparent;
  }
}
</style>
