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
    <div class="card new-picture" id="new-picture">
      <router-link to="/new-canvas">New picture</router-link>
    </div>
  </section>
  <teleport to="body">
    <overlay :show="showOverlay" @click="collapsePicture"></overlay>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "../store";

export default defineComponent({
  setup() {
    const store = useStore();
    const pictures = computed(() => store.state.pictures.userPictures);
    const expandedPicture = ref<string>("");
    const showOverlay = ref(false);

    function expandPicture(pictureId: string) {
      expandedPicture.value = pictureId;
      showOverlay.value = true;
    }

    function collapsePicture() {
      expandedPicture.value = "";
      showOverlay.value = false;
    }

    return {
      pictures,
      expandedPicture,
      showOverlay,
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

@media (min-width: 767px) {
  .gallery {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
