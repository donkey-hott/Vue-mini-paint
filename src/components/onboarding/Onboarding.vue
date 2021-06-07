<template>
  <div
    :style="`left: ${tooltipPosition.left}px; top: ${tooltipPosition.top}px;`"
    ref="tooltipElement"
    class="tooltip"
  >
    <span class="tooltip__text">{{ currentStep?.textContent }}</span>
    <div class="tooltip__buttons">
      <button @click="decrementStep">Previous</button>
      <button @click="endOnboarding">End preview</button>
      <button @click="showNextPage">Next</button>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { ActionTypes } from "@/store/modules/auth/actions/action-types";
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
      const element = document.getElementById(currentStep.value?.elementId);
      if (!element || !tooltipElement.value) return position;
      const clientRect = element.getBoundingClientRect();

      position.left =
        clientRect.right + document.documentElement.scrollLeft + 10;
      position.top = clientRect.top + document.documentElement.scrollTop;

      console.log(element);
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

    function endOnboarding() {
      const onboardingInfoJSON = {
        seen: true,
        version: JSON.stringify(store.state.onboarding.config),
      };
      store.dispatch(ActionTypes.SET_ONBOARDING_INFO, onboardingInfoJSON);
    }

    return {
      tooltipElement,
      tooltipPosition,
      currentStep,
      showNextPage,
      endOnboarding,
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
