<template>
  <div
    :style="`left: ${tooltipPosition.left}px; top: ${tooltipPosition.top}px;`"
    ref="tooltipElement"
    class="tooltip"
  >
    <span class="tooltip__text">{{ currentStep?.textContent }}</span>
    <div class="tooltip__buttons">
      <button @click="endOnboarding">End preview</button>
      <button v-show="!isLastStep" @click="incrementStep">Next</button>
    </div>
  </div>
  <teleport to="body">
    <overlay :show="false"></overlay>
  </teleport>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { ActionTypes } from "@/store/modules/auth/actions/action-types";
import { computed, defineComponent, ref, watch } from "vue";
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

    const showOnboarding = computed(() => {
      return store.state.onboarding.showOnboarding;
    });

    const currentElement = ref<HTMLElement | null>(
      document.getElementById(steps?.value[0].elementId)
    );

    const isLastStep = computed(() => {
      return steps.value.length - 1 === stepIndex.value;
    });

    const currentStep = computed(() => {
      return steps.value[stepIndex.value];
    });

    /* fires after "incrementStep" function */
    watch(currentStep, () => {
      const route = currentStep.value.nextRoute;
      if (!route) return;

      router.push(route).then(() => {
        setElement();
      });
    });

    function setElement() {
      currentElement.value = document.getElementById(
        currentStep.value?.elementId
      );
    }

    const tooltipPosition = computed(() => {
      const position = {
        left: 0,
        top: 0,
      };

      if (!currentElement.value || !tooltipElement.value) return position;
      const clientRect = currentElement.value.getBoundingClientRect();
      const INDENT_FROM_TOOLTIP = 10;

      position.left =
        clientRect.right +
        document.documentElement.scrollLeft +
        INDENT_FROM_TOOLTIP;
      position.top = clientRect.top + document.documentElement.scrollTop;

      return position;
    });

    watch(tooltipPosition, (position) => {
      highlightElement();
      scrollToElement(position.top);
    });

    function highlightElement() {
      if (!tooltipElement.value || !currentElement.value) return;
      currentElement.value.classList.add("highlighted-element");
    }

    function fadeElement() {
      if (!tooltipElement.value || !currentElement.value) return;
      currentElement.value.classList.remove("highlighted-element");
    }

    function scrollToElement(position: number) {
      if (!tooltipElement.value) return;

      window.scroll({
        top: position,
        behavior: "smooth",
      });
    }

    function incrementStep() {
      fadeElement();
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
      tooltipPosition,
      tooltipElement,
      currentStep,
      showOnboarding,
      isLastStep,
      incrementStep,
      endOnboarding,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/colors.scss";

.tooltip {
  padding: 0.3em;
  min-width: 40%;
  border-radius: 7px;
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

    button {
      background: $emphasizing;
      padding: 0.3em;
      font-family: inherit;
      color: #fff;
      border: 0;
      cursor: pointer;
      border-radius: 7px;

      &:nth-child(2) {
        background: $red-alert;
      }
    }
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
