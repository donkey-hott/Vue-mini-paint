<template>
  <section class="slider-root">
    <div class="slider-root__container">
      <span class="control control-left" @click="showPrevSlide">&lt;</span>
      <transition-group tag="div" name="appearing" class="slides">
        <slider-slide
          class="slides__slide"
          v-for="pictureSlide in visibleSlides"
          :key="pictureSlide"
        >
          <img
            class="slides__picture"
            :src="pictureSlide.imgURL"
            :alt="pictureSlide.title"
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
import { computed, defineComponent, onMounted, ref, watch } from "vue";
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
  setup(props) {
    const visibleSlides = ref<Pictures[]>([]);
    const currentSlide = ref(0);

    const randomPictures = computed(() => {
      const randomPicturesGetters = store.getters.getRandomPictures;
      return randomPicturesGetters(5);
    });

    function showNextSlide() {
      if (currentSlide.value === Object.keys(randomPictures.value).length - 1)
        return;

      currentSlide.value += 1;
      addSlide();
    }

    function showPrevSlide() {
      if (currentSlide.value === 0) return;

      currentSlide.value -= 1;
      removeSlide();
    }

    /* TODO: возможно, вынести в отдельный класс с интерфейсом все методы, которые касаются visibleSlides */

    function addSlide() {
      const picture = Object.values(randomPictures.value)[
        currentSlide.value
      ] as Pictures;

      visibleSlides.value.splice(0, 0, picture);
    }

    function removeSlide() {
      visibleSlides.value.shift();
    }

    /* add a picture in array with slides when pictures are loaded*/
    watch(randomPictures, () => {
      if (!visibleSlides.value.length) {
        addSlide();
      }
    });

    onMounted(() => {
      // if (!slidesElem.value) return;
      /* setup slidesPerView */
      // slidesElem.value.style.width = `${100 / props.itemsPerView}%`;
      /* setup gap between slides (based on flex gap property) */
      // slidesElem.value.style.gap = `${props.gap}px`;
    });

    return {
      visibleSlides,
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
      height: inherit;

      &__slide {
        transition: all 0.5s;
        height: 98%;
      }

      &__picture {
        height: 100%;
        background: white;
      }
    }
  }
}

.appearing-enter-active {
  animation: fade-in 0.5s;
}

.appearing-leave-active {
  animation: fade-in 0.5s reverse;
  position: absolute;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
