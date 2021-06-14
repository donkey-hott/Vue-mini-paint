<template>
  <main>
    <h2>Manage public pictures</h2>
    <form @submit.prevent="saveChanges">
      <article v-for="(url, id) in publicPictures" :key="id">
        <label :for="id"
          >Picture URL
          <input
            class="truncate"
            @blur="updateURL(id, $event.target.value)"
            type="url"
            :id="id"
            :value="url"
          />
        </label>
        <div>
          <button
            class="delete-btn btn btn-sm btn-accent"
            title="Remove picture"
            @click="removePicture(id)"
          >
            &times;
          </button>
          <div class="picture-wrapper">
            <img :src="url" alt="" />
          </div>
        </div>
      </article>
      <article>
        <label for="newPicture"
          >Add picture
          <input
            class="truncate"
            v-model="newPictureURL"
            type="url"
            id="newPicture"
            placeholder="Type in picture URL"
          />
        </label>
        <button class="btn btn-primary btn-sm" @click.prevent="addPicture">
          Add picture
        </button>
      </article>
      <button class="btn btn-primary" type="submit">Save changes</button>
    </form>
  </main>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { MutationTypes } from "@/store/modules/pictures/mutations/mutation-types";
import { ActionTypes } from "@/store/modules/pictures/actions/action-types";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const newPictureURL = ref<string>("");
    const publicPictures = computed(() => {
      return store.state.pictures.publicPictures;
    });

    function updateURL(id: string, url: string) {
      store.commit(MutationTypes.UPDATE_PUBLIC_PICTURE_URL, { id, url });
    }

    function addPicture() {
      if (!newPictureURL.value.length) return;

      store.dispatch(ActionTypes.ADD_PUBLIC_PICTURE, newPictureURL.value);
      clearField();
    }

    function clearField() {
      newPictureURL.value = "";
    }

    function removePicture(pictureId: string) {
      store.commit(MutationTypes.REMOVE_PUBLIC_PICTURE, pictureId);
      store.dispatch(ActionTypes.UPDATE_PUBLIC_PICTURES);
    }

    function saveChanges() {
      store.dispatch(ActionTypes.UPDATE_PUBLIC_PICTURES);

      router.push("/swiper");
    }

    onMounted(() => {
      if (!Object.keys(publicPictures.value).length) {
        store.dispatch(ActionTypes.GET_PUBLIC_PICTURES);
      }
    });

    return {
      newPictureURL,
      publicPictures,
      updateURL,
      addPicture,
      removePicture,
      saveChanges,
    };
  },
});
</script>

<style lang="scss" scoped>
article {
  display: flex;
  justify-content: space-between;
  padding: 0.3em;
  margin: 0.5em 1em;
  background: var(--bg-secondary);
  border-radius: var(--btn-border-radius);
  box-shadow: 0 3px 6px rgb(0 0 0 / 16%), 0 3px 6px rgb(0 0 0 / 23%);

  label {
    display: flex;
    flex-direction: column;
    justify-content: center;

    input {
      margin-top: 0.5em;
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .delete-btn {
      width: 25px;
      height: 25px;
      margin: 0.5em;
    }

    .picture-wrapper {
      width: 230px;
      height: 180px;
      align-self: center;
      margin-left: 1em;

      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
