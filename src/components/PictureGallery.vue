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
    <div
      v-intersection="{ handler: loadNextPage, options: intersectionOptions }"
      class="card new-picture"
    >
      <router-link to="/new-canvas">New picture</router-link>
    </div>
  </section>
  <div
    @click="collapsePicture"
    class="overlay"
    :class="{ 'overlay--shown': expandedPicture }"
  ></div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { useStore } from "../store";
import { intersection } from "@/directives/intersection";
import { ScrollwisePagination } from "@/utils/pagination";
import { ActionTypes } from "@/store/modules/pictures/actions/action-types";

export default defineComponent({
  directives: {
    intersection,
  },
  setup() {
    const store = useStore();
    const pictures = computed(() => store.state.pictures.userPictures);
    const expandedPicture = ref<string>("");
    // eslint-disable-next-line no-undef
    const intersectionOptions = ref<IntersectionObserverInit | undefined>({
      threshold: 0.25,
    });
    const paginator = new ScrollwisePagination();

    function expandPicture(pictureId: string) {
      expandedPicture.value = pictureId;
    }

    function collapsePicture() {
      expandedPicture.value = "";
    }

    function loadNextPage(entry: IntersectionObserverEntry) {
      if (entry.isIntersecting && !paginator.isLastPage) {
        paginator.incrementCurrentPage();
        const selectionBounds = paginator.calcSelectionBounds();
        store.dispatch(ActionTypes.LOAD_PICTURES, selectionBounds).then(() => {
          if (store.getters.picturesNumber < selectionBounds.end) {
            paginator.isLastPage = true;
          }
        });
      }
    }

    onMounted(() => {
      paginator.resetState();
    });

    return {
      pictures,
      intersectionOptions,
      expandedPicture,
      expandPicture,
      collapsePicture,
      loadNextPage,
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
    min-height: 19.2em;

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

    & .new-picture {
      min-height: 9em;
    }
  }
}
</style>
