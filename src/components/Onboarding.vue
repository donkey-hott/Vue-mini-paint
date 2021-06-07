<template>
  <div ref="tooltipElement" class="tooltip">
    <span class="tooltip__text">{{ currentStep?.textContent }}</span>
    <div class="tooltip__buttons">
      <button @click="decrementStep">Previous</button>
      <button @click="endOnboarding">End preview</button>
      <button @click="incrementStep">Next</button>
    </div>
  </div>
  <teleport to="body">
    <overlay :show="true"></overlay>
  </teleport>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { ActionTypes } from "@/store/modules/auth/actions/action-types";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
/* TODO: написать компьютед для позиционирования тултипа так, чтобы он не зависел от
других вычисляемых свойств */
/* TODO: rewrite "fadeElement" call so that it doesn't violate SRP */

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const tooltipElement = ref<HTMLElement | null>(null);
    const stepIndex = ref(0);

    const steps = computed(() => {
      return store.state.onboarding.config;
    });

    const showOnboarding = computed(() => {
      return store.state.onboarding.showOnboarding;
    });

    const currentElement = computed(() => {
      return document.getElementById(currentStep.value?.elementId);
    });

    function positionTooltip() {
      if (!currentElement.value || !tooltipElement.value) return;
      const clientRect = currentElement.value.getBoundingClientRect();

      tooltipElement.value.style.left = `${
        clientRect.right + document.documentElement.scrollLeft + 10
      }px`;
      tooltipElement.value.style.top = `${
        clientRect.top + document.documentElement.scrollTop
      }px`;

      highlightElement();
      scrollToElement(clientRect.top + document.documentElement.scrollTop);
    }

    function highlightElement() {
      if (!tooltipElement.value || !currentElement.value) return;
      currentElement.value.classList.add("highlighted-element");
    }

    function fadeElement() {
      if (!tooltipElement.value || !currentElement.value) return;
      currentElement.value.classList.remove("highlighted-element");
    }

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

    function incrementStep() {
      if (steps.value.length - 1 === stepIndex.value) return;
      fadeElement();
      stepIndex.value += 1;
    }

    watch(currentStep, () => {
      const route = currentStep.value.nextRoute;
      if (!route) return;
      router.push(route).then(() => {
        positionTooltip();
      });
    });

    function endOnboarding() {
      const onboardingInfoJSON = {
        seen: true,
        version: JSON.stringify(store.state.onboarding.config),
      };
      store.dispatch(ActionTypes.SET_ONBOARDING_INFO, onboardingInfoJSON);
    }

    onMounted(() => {
      positionTooltip();
    });

    return {
      tooltipElement,
      currentStep,
      showOnboarding,
      incrementStep,
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
  z-index: 20;

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
