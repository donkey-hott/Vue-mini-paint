<template>
  <div v-if="showOnboarding" ref="tooltipElement" class="tooltip">
    <span class="tooltip__text">{{ currentStep?.textContent }}</span>
    <div class="tooltip__buttons">
      <button @click="finishOnboarding">End preview</button>
      <button @click="publisher.showNextStep" v-show="!isLastElement">
        Next
      </button>
    </div>
  </div>
  <teleport to="body">
    <overlay :show="true"></overlay>
  </teleport>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { ActionTypes } from "@/store/modules/auth/actions/action-types";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const tooltipElement = ref<HTMLElement | null>(null);
    const stepIndex = ref(0);
    const publisher = ref<Publisher | null>(null);

    const steps = computed(() => {
      return store.state.onboarding.config;
    });

    const showOnboarding = computed(() => {
      return store.state.onboarding.showOnboarding;
    });

    const currentStep = computed(() => {
      return steps.value[stepIndex.value];
    });

    const isLastElement = computed(() => {
      return steps.value.length - 1 === stepIndex.value;
    });

    function finishOnboarding() {
      const onboardingInfoJSON = {
        seen: true,
        version: JSON.stringify(store.state.onboarding.config),
      };
      store.dispatch(ActionTypes.SET_ONBOARDING_INFO, onboardingInfoJSON);
    }

    function getElement(passedIndex?: number) {
      return document.getElementById(
        steps?.value[passedIndex || stepIndex.value].elementId
      );
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

      showNextStep() {
        stepIndex.value += 1;
        const route = currentStep.value.nextRoute;

        router.push(route).then(() => {
          this.notify();
        });
      }
    }

    class TooltipPositionObserver implements Subscriber {
      update() {
        const currentElement = getElement();

        if (!currentElement || !tooltipElement.value) return;
        const clientRect = currentElement.getBoundingClientRect();
        const INDENT_FROM_TOOLTIP = 10;

        /* removes "transform" property that centers tooltip window initially */
        tooltipElement.value.classList.add("tooltip--no-transform");

        tooltipElement.value.style.left = `${
          clientRect.right +
          document.documentElement.scrollLeft +
          INDENT_FROM_TOOLTIP
        }px`;
        tooltipElement.value.style.top = `${
          clientRect.top + document.documentElement.scrollTop
        }px`;
        /* TODO: */
        this.scrollToElement(
          clientRect.top + document.documentElement.scrollTop
        );
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
    });

    return {
      tooltipElement,
      currentStep,
      isLastElement,
      publisher,
      showOnboarding,
      finishOnboarding,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/colors.scss";

.tooltip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

  &--no-transform {
    transform: none;
  }

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
