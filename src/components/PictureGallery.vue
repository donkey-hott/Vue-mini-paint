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
      <figcaption class="card__title truncate">
        {{ pictureObj.title }}
      </figcaption>
    </figure>
    <div class="card new-picture">
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
import { defineComponent, computed, ref } from "vue";
import { useStore } from "../store";

export default defineComponent({
  setup() {
    const store = useStore();
    const pictures = computed(() => store.state.pictures.userPictures);
    const expandedPicture = ref<string>("");

    function expandPicture(pictureId: string) {
      expandedPicture.value = pictureId;
    }

    function collapsePicture() {
      expandedPicture.value = "";
    }

    return {
      pictures,
      expandedPicture,
      expandPicture,
      collapsePicture,
    };
  },
});
</script>

<style lang="scss" scoped>
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
    background: var(--bg-secondary);
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
    }
  }

  .new-picture {
    border: 4px dashed var(--color-accent);
    min-height: 8em;

    & > a {
      height: 100%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
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
