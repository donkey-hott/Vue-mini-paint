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
    <div ref="bulletsContainer" class="bullets">
      <span ref="currentBullet" class="bullets__current"></span>
      <span
        v-for="index in randomPictures.length"
        @click="goToSlide(index - 1)"
        :key="index"
        class="bullets__empty"
      ></span>
    </div>
  </section>
</template>

<script lang="ts">
import store from "@/store";
import { Pictures } from "@/store/types";
import { computed, defineComponent, watch, ref } from "vue";
import SliderSlide from "./SliderSlide.vue";

// TODO: ADD BULLETS BELOW SLIDER

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
    animation: {
      type: String,
      default: "slide",
      required: false,
    },
  },
  setup(props) {
    const currentIndex = ref(0);
    const transitionName = ref("");
    const currentBullet = ref<HTMLElement | null>(null);
    const bulletsContainer = ref<HTMLElement | null>(null);

    const randomPictures = computed(() => {
      const randomPicturesGetters = store.getters.getRandomPictures;
      return Object.values(randomPicturesGetters(5));
    });

    const currentSlide = computed(() => {
      if (!randomPictures.value) return {};

      const slide = randomPictures.value[infiniteIndex.value] as Pictures;
      return slide?.[1];
    });

    const infiniteIndex = computed(() => {
      return Math.abs(currentIndex.value) % randomPictures.value.length;
    });

    function showNextSlide() {
      currentIndex.value += 1;
    }

    function showPrevSlide() {
      currentIndex.value -= 1;
    }

    function goToSlide(index: number) {
      currentIndex.value = index;
    }

    function translateBullet() {
      if (!currentBullet.value || !bulletsContainer.value) return;

      const shiftFactor = Math.ceil(
        bulletsContainer.value?.offsetWidth / randomPictures.value.length
      );

      currentBullet.value.style.left = `${infiniteIndex.value * shiftFactor}px`;
    }

    /* this watcher defines animation direction basing on
      the comparison of 'currentIndex' values and executes translating
      of navigation bullets
     */

    watch(currentIndex, (currentValue, oldValue) => {
      transitionName.value =
        currentValue > oldValue
          ? `${props.animation}-next`
          : `${props.animation}-prev`;

      translateBullet();
    });

    return {
      currentIndex,
      currentSlide,
      transitionName,
      randomPictures,
      currentBullet,
      bulletsContainer,
      /* functions */
      showNextSlide,
      showPrevSlide,
      goToSlide,
    };
  },
});
</script>

<style scoped lang="scss">
.slider-root {
  position: relative;
  width: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__container {
    width: 100%;
    height: inherit;
    overflow: hidden;

    .control {
      position: absolute;
      top: 0;
      height: 100%;
      padding: 0.3em;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      font-size: 3em;
      z-index: 10;
      transition: background 0.3s;
      mix-blend-mode: difference;

      &:hover {
        background: rgba(191, 191, 191, 0.2);
      }
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

  .bullets {
    margin: 0.3em 0;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.2em;

    &__empty,
    &__current {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    &__empty {
      background: #e2e2e2;
      cursor: pointer;
    }

    &__current {
      position: absolute;
      left: 0;
      background: #08aaf5;
      transition: all 0.3s;
    }
  }
}

/* ==== ANIMATIONS ==== */

/* NOTE: animation classes consist
  of animation name + direction + Vue transition hook
*/

/* ==== SLIDE NEXT ==== */

.slide-next-enter-active {
  visibility: hidden;
  transform: translate(-100%);
}

.slide-next-leave-to {
  transform: translate(100%);
}

/* ==== SLIDE PREV ====*/

.slide-prev-enter-active {
  transform: translate(100%);
}

.slide-prev-leave-to {
  transform: translate(-100%);
}

/* ==== FADE NEXT ==== */

.fade-next-enter {
  opacity: 1;
}

.fade-next-enter-active {
  opacity: 0;
}

.fade-next-leave {
  opacity: 1;
}

.fade-next-leave-to {
  opacity: 0;
}

/* ==== FADE PREV ==== */

.fade-prev-enter {
  opacity: 1;
}

.fade-prev-enter-active {
  opacity: 0;
}

.fade-prev-leave {
  opacity: 1;
}

.fade-prev-leave-to {
  opacity: 0;
}

.slide-next-leave-to,
.slide-prev-leave-to,
.fade-next-leave-to,
.fade-prev-leave-to {
  position: absolute;
}
</style>
