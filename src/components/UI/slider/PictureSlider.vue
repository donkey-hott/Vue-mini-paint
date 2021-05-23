<template>
  <section class="slider-root">
    <div class="slider-root__container">
      <span class="control control-left" @click="showPrevSlide">&lt;</span>
      <transition-group tag="div" :name="transitionName" class="slides">
        <slider-slide
          class="slides__slide"
          v-for="i in [infiniteIndex]"
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
    <div
      v-if="navigation === 'bullets'"
      ref="bulletsContainer"
      class="navigation"
    >
      <span ref="currentBullet" class="navigation__current-bullet"></span>
      <span
        v-for="index in randomPictures.length"
        @click="goToSlide(index - 1)"
        :key="index"
        class="navigation__empty-bullet"
      ></span>
    </div>
    <div v-if="navigation === 'fraction'" class="navigation">
      <span>{{ infiniteIndex + 1 }} / {{ randomPictures.length }}</span>
    </div>
  </section>
</template>

<script lang="ts">
import store from "@/store";
import { Pictures } from "@/store/types";
import { computed, defineComponent, watch, ref, onMounted } from "vue";
import SliderSlide from "./SliderSlide.vue";

/* TODO: reduce dependency of slider from pictures */
/* TODO: do something with violation of OCP in navigation */

export default defineComponent({
  components: {
    SliderSlide,
  },
  props: {
    animation: {
      type: String,
      default: "slide",
      required: false,
    },
    navigation: {
      type: String,
      default: "bullets",
      required: false,
    },
    autoplayDelay: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  setup(props) {
    const currentIndex = ref(0);
    const transitionName = ref("");
    const currentBullet = ref<HTMLElement | null>(null);
    const bulletsContainer = ref<HTMLElement | null>(null);
    const autoplayTimeout = ref<number>();

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
      return randomPictures.value.length
        ? Math.abs(currentIndex.value) % randomPictures.value.length
        : -1;
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

    function autoplay() {
      clearInterval(autoplayTimeout.value);

      if (props.autoplayDelay > 0) {
        autoplayTimeout.value = setInterval(showNextSlide, props.autoplayDelay);
      }
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
      autoplay();
    });

    onMounted(() => {
      autoplay();
    });

    return {
      infiniteIndex,
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

  .navigation {
    margin: 0.3em 0;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.2em;

    &__empty-bullet,
    &__current-bullet {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    &__empty-bullet {
      background: #e2e2e2;
      cursor: pointer;
    }

    &__current-bullet {
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
