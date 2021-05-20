<template>
  <section class="slider-root">
    <div class="slider-root__container">
      <span class="control control-left" @click="showPreviousSlide">&lt;</span>
      <div ref="slidesElem" class="slides">
        <slot name="slides"></slot>
      </div>
      <span class="control control-right" @click="showNextSlide">&gt;</span>
    </div>
  </section>
</template>

<script lang="ts">
import store from "@/store";
import { computed, ComputedRef, defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    itemsPerView: {
      type: Number,
      default: 1,
      required: false,
      /* TODO: ADD PROP VALIDATION */
      // validator: (value: number) => {
      //   const slidesNum = document.querySelector(".slides")?.childElementCount;

      //   if (!slidesNum) return false;
      //   return value > 0 && value <= slidesNum;
      // },
    },
    gap: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  setup(props) {
    const slidesElem = ref<HTMLElement | null>(null);
    let currentSlide = ref(0);

    function showNextSlide() {
      if (!slidesNumber.value) return;
      if (currentSlide.value === slidesNumber.value - props.itemsPerView)
        return;

      currentSlide.value += 1;
      console.log(currentSlide.value);
      showSlide();
    }

    function showPreviousSlide() {
      if (!currentSlide.value) return;

      currentSlide.value -= 1;
      showSlide();
    }

    function showSlide() {
      if (!slidesElem.value) return;

      slidesElem.value.style.transform = `translateX(-${
        slidesElem.value.offsetWidth * currentSlide.value +
        props.gap * currentSlide.value
      }px)`;
    }

    const slidesNumber: ComputedRef<number | undefined> = computed(() => {
      return slidesElem.value?.childElementCount;
    });

    const randomPictures: ComputedRef<number | undefined> = computed(() => {
      const randomPicturesGetters = store.getters.getRandomPictures;
      console.log(randomPicturesGetters);
      return randomPicturesGetters(5);
    });

    onMounted(() => {
      if (!slidesElem.value) return;
      /* setup slidesPerView */
      slidesElem.value.style.width = `${100 / props.itemsPerView}%`;
      /* setup gap between slides (based on flex gap property) */
      slidesElem.value.style.gap = `${props.gap}px`;
    });

    return {
      slidesElem,
      /* methods */
      showNextSlide,
      showPreviousSlide,
      randomPictures,
    };
  },
});
</script>

<style scoped lang="scss">
.slider-root {
  position: relative;
  width: 100%;
  min-height: 100px;

  &__container {
    width: 100%;
    height: inherit;
    overflow: hidden;

    .control {
      position: absolute;
      top: 0;
      height: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      font-size: 2em;
      z-index: 10;
    }

    .control-right {
      right: 0;
    }

    .control-left {
      left: 0;
    }

    .slides {
      display: flex;
      transition: all 0.3s;
      height: inherit;
    }
  }
}
</style>
