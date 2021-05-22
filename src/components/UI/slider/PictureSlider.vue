<template>
  <section class="slider-root">
    <div class="slider-root__container">
      <span class="control control-left" @click="showPrevSlide">&lt;</span>
      <transition-group tag="div" :name="transitionName" class="slides">
        <slider-slide
          class="slides__slide"
          v-for="i in [currentIndex]"
          :key="i"
        >
          <img
            class="slides__picture"
            :src="currentSlide?.imgURL"
            :alt="currentSlide?.title"
          />
        </slider-slide>
      </transition-group>
      <span class="control control-right" @click="showNextSlide">&gt;</span>
    </div>
  </section>
</template>

<script lang="ts">
import store from "@/store";
import { Pictures } from "@/store/types";
import { computed, defineComponent, ref } from "vue";
import SliderSlide from "./SliderSlide.vue";

export default defineComponent({
  components: {
    SliderSlide,
  },
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
  setup() {
    const visibleSlides = ref<Pictures[]>([]);
    const currentIndex = ref(0);
    const transitionName = ref("");

    const randomPictures = computed(() => {
      const randomPicturesGetters = store.getters.getRandomPictures;
      return Object.values(randomPicturesGetters(5));
    });

    const currentSlide = computed(() => {
      if (!randomPictures.value) return {};
      const slide = randomPictures.value[
        Math.abs(currentIndex.value) % randomPictures.value.length
      ] as Pictures;
      return slide?.[1];
    });

    function showNextSlide() {
      transitionName.value = "fade-next";
      currentIndex.value += 1;
    }

    function showPrevSlide() {
      transitionName.value = "fade-prev";
      currentIndex.value -= 1;
    }

    return {
      visibleSlides,
      currentIndex,
      currentSlide,
      transitionName,
      /* functions */
      showNextSlide,
      showPrevSlide,
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
      height: 50vh;
      position: relative;

      &__slide {
        transition: all 0.5s;
        height: 100%;
      }

      &__picture {
        height: 100%;
        background: white;
      }
    }
  }
}

// .next-enter-active {
//   transform: translate(100%);
// }

// .next-leave-to {
//   transform: translate(-100%);
// }

// .prev-enter-active {
//   transform: translate(-100%);
// }

// .prev-leave-to {
//   transform: translate(100%);
// }

.fade-next-enter {
  opacity: 1;
}

.fade-next-enter-active {
  opacity: 0;
}

.fade-next-leave {
  opacity: 1;
  position: absolute;
}

.fade-next-leave-to {
  position: absolute;
  opacity: 0;
}

.fade-prev-enter {
  opacity: 1;
}

.fade-prev-enter-active {
  opacity: 0;
}

.fade-prev-leave {
  position: absolute;
  opacity: 1;
}

.fade-prev-leave-to {
  position: absolute;
  opacity: 0;
}

// .next-leave-to,
// .prev-leave-to {
//   position: absolute;
// }
</style>
