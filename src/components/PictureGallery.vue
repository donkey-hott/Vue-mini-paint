<template>
  <section class="gallery">
    <figure
      v-for="(pictureObj, pictureId, idx) in pictures"
      :key="idx"
      class="card"
    >
      <img
        class="card__picture"
        :class="{ 'card__picture--shown': expandedPicture === pictureId }"
        :src="pictureObj.imgURL"
        :alt="pictureId"
        @click="expandPicture(pictureId)"
      />
      <hr />
      <figcaption class="card__title">{{ pictureObj.title }}</figcaption>
    </figure>
    <div class="card new-picture">
      <router-link to="/new-canvas">New picture</router-link>
    </div>
  </section>
  <the-spinner v-show="arePicturesLoading"></the-spinner>
  <div
    @click="collapsePicture"
    class="overlay"
    :class="{ 'overlay--shown': expandedPicture }"
  ></div>
</template>

<script lang="ts">
import {
  PictureLoaderObserver,
  PaginationObserver,
} from "@/utils/observer/observers";
import { createThrottler } from "@/utils/throttler";
import { Publisher } from "@/utils/observer/publisher";
import { defineComponent, computed, ref, onMounted } from "vue";
import { useStore } from "../store";
import { ActionTypes } from "@/store/modules/pictures/actions/action-types";

export default defineComponent({
  // TODO: ADD BUTTON "NEW PICTURE" TO THE NAVBAR
  setup() {
    const store = useStore();
    const pictures = computed(() => store.state.pictures.userPictures);
    const arePicturesLoading = computed(
      () => store.state.pictures.arePicturesLoading
    );
    const expandedPicture = ref<string>("");

    function expandPicture(pictureId: string) {
      expandedPicture.value = pictureId;
    }

    function collapsePicture() {
      expandedPicture.value = "";
    }

    function initializeObserver() {
      const publisher = new Publisher();
      const paginationObserver = new PaginationObserver();
      const pictureLoaderObserver = new PictureLoaderObserver();
      const { paginator } = paginationObserver;
      const throttle = createThrottler();

      publisher.subscribe(paginationObserver);
      publisher.subscribe(pictureLoaderObserver);

      document.addEventListener("scroll", () => {
        throttle(() => {
          const htmlElem = document.querySelector("html");
          const isScrollEnd = paginationObserver.paginator.isScrollEnd(
            htmlElem
          );
          if (
            isScrollEnd &&
            paginator.selectionBounds.end === store.getters.picturesNumber
          )
            publisher.notify(paginator.selectionBounds);
        }, 200);
      });
    }

    onMounted(() => {
      if (!store.getters.picturesNumber) {
        store.dispatch(ActionTypes.LOAD_PICTURES, { start: 1, end: 8 });
      }
      initializeObserver();
    });

    return {
      pictures,
      arePicturesLoading,
      expandedPicture,
      expandPicture,
      collapsePicture,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/colors.scss";

.gallery {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5em;
  justify-items: center;

  &::-webkit-scrollbar {
    display: none;
  }

  .card {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.3em;
    margin: 0.5em 1em;
    width: 90%;
    background: $light-background;
    box-shadow: 0 3px 6px rgb(0 0 0 / 16%), 0 3px 6px rgb(0 0 0 / 23%);

    &__picture {
      width: 100%;
      height: 100%;
      margin-bottom: 1em;
      cursor: pointer;
      background: #fff !important;

      &--shown {
        position: fixed;
        top: 50%;
        left: 50%;
        width: auto;
        height: auto;
        max-height: 500px;
        max-width: 600px;
        transform: translate(-50%, -50%);
        z-index: 30;
        background: #fff;
      }
    }
    figcaption {
      margin-top: 0.3em;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .new-picture {
    border: 4px dashed $emphasizing;
    min-height: 8em;

    & > a {
      height: 100%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      color: #fff;
    }
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: scale(0);
  background: rgba(0, 0, 0, 0.8);
  pointer-events: none;
  z-index: 10;

  &--shown {
    pointer-events: all;
    transform: scale(1);
    cursor: default;
  }
}

@media (min-width: 767px) {
  .gallery {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
