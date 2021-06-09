<template>
  <div v-if="showOnboarding" ref="tooltipElement" class="tooltip">
    <span class="tooltip__text">{{ currentStep?.textContent }}</span>
    <div class="tooltip__buttons">
      <button @click="publisher.finishOnboarding">End preview</button>
      <button @click="incrementStepIndex" v-show="!isLastStep">Next</button>
    </div>
  </div>
  <teleport to="body">
    <overlay :show="showOnboarding"></overlay>
  </teleport>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { ActionTypes } from "@/store/modules/onboarding/actions/action-types";
import { MutationTypes } from "@/store/modules/onboarding/mutations/mutation-types";
import { computed, defineComponent, onMounted, watch, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const tooltipElement = ref<HTMLElement | null>(null);
    const stepIndex = ref(0);
    const publisher = ref<Publisher | null>(null);

    const steps = computed(() => {
      return store.state.onboarding.steps;
    });

    const showOnboarding = computed(() => {
      return store.state.onboarding.showOnboarding;
    });

    const currentStep = computed(() => {
      return steps.value[stepIndex.value];
    });

    watch(steps, () => {
      /* triggers when user passes authentication */
      if (showOnboarding.value) {
        publisher.value?.showStep();
      }
    });

    const isLastStep = computed(() => {
      return steps.value.length - 1 === stepIndex.value;
    });

    function getElement(passedIndex?: number) {
      let index = passedIndex;
      if (passedIndex === undefined || passedIndex < 0) {
        index = stepIndex.value;
      }
      return document.getElementById(steps?.value[index as number].elementId);
    }

    function incrementStepIndex() {
      if (isLastStep.value) return;
      stepIndex.value += 1;
      publisher.value?.showStep();
    }

    /* PUBLISHER-SUBSCRIBER LOGIC */

    interface Subscriber {
      update(publisher?: IPublisher): void;
    }

    interface IPublisher {
      notify(): void;
      subscribe(subscriber: Subscriber): void;
      unsubscribe(subscriber: Subscriber): void;
    }

    /* concrete classes */

    class Publisher implements IPublisher {
      private subscribers: Array<Subscriber>;

      constructor() {
        this.subscribers = [];
      }

      notify() {
        this.subscribers.forEach((subscriber) => {
          subscriber.update();
        });
      }

      subscribe(subscriber: Subscriber) {
        if (this.subscribers.includes(subscriber)) return;

        this.subscribers.push(subscriber);
      }

      unsubscribe(subscriber: Subscriber) {
        const subscriberIdx = this.subscribers.indexOf(subscriber);
        if (subscriberIdx === -1) return;

        this.subscribers = this.subscribers.splice(subscriberIdx, 1);
      }

      showStep() {
        const route = currentStep.value.nextRoute;
        router.push(route).then(() => {
          this.notify();
        });
      }

      finishOnboarding() {
        const onboardingInfoJSON = JSON.stringify(store.state.onboarding.steps);

        store.commit(MutationTypes.SHOW_ONBOARDING, false);
        store.dispatch(ActionTypes.SEND_ONBOARDING_INFO, onboardingInfoJSON);
        this.notify();
      }
    }

    class TooltipPositionObserver implements Subscriber {
      update() {
        const currentElement = getElement();

        if (!currentElement || !tooltipElement.value) return;
        const clientRect = currentElement.getBoundingClientRect();
        const INDENT_FROM_TOOLTIP = 10;
        const positionX =
          clientRect.right +
          document.documentElement.scrollLeft +
          INDENT_FROM_TOOLTIP;
        const positionY = clientRect.top + document.documentElement.scrollTop;

        tooltipElement.value.style.left = `${positionX}px`;
        tooltipElement.value.style.top = `${positionY}px`;
        this.scrollToElement(positionY);
      }

      private scrollToElement(position: number) {
        if (!tooltipElement.value) return;

        window.scroll({
          top: position,
          behavior: "smooth",
        });
      }
    }

    class ElementsHighlightingObserver implements Subscriber {
      update() {
        const prevElement = getElement(stepIndex.value - 1);
        const currentElement = getElement();

        prevElement?.classList.remove("highlighted-element");
        currentElement?.classList.add("highlighted-element");
      }
    }

    onMounted(() => {
      publisher.value = new Publisher();
      const elementsHighlightingObserver = new ElementsHighlightingObserver();
      publisher.value.subscribe(elementsHighlightingObserver);

      const tooltipPositionObserver = new TooltipPositionObserver();
      publisher.value.subscribe(tooltipPositionObserver);

      publisher.value.showStep();
    });

    return {
      tooltipElement,
      currentStep,
      isLastStep,
      publisher,
      incrementStepIndex,
      showOnboarding,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/colors.scss";

.tooltip {
  position: absolute;
  padding: 0.3em;
  min-width: 40%;
  border-radius: 7px;
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
