<template>
  <main>
    <swiper
      class="swiper"
      :slides-per-view="1"
      navigation
      :loop="true"
      :pagination="{ clickable: true }"
    >
      <swiper-slide
        class="picture"
        v-for="(url, id) in publicPictures"
        :key="id"
      >
        <img :src="url" />
      </swiper-slide>
    </swiper>
    <p v-if="!currentUser">
      To see more, please <router-link to="/sign-in">sign in</router-link> or
      <router-link to="/sign-up">sign up</router-link>
    </p>
  </main>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Swiper, SwiperSlide } from "swiper/vue";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.min.css";

SwiperCore.use([Navigation, Pagination]);

import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "@/store";
import { ActionTypes } from "@/store/modules/pictures/actions/action-types";

export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
  },

  setup() {
    const store = useStore();
    const swiperComponentRef = ref<any>(null);
    const currentUser = computed(() => {
      return store.state.auth.currentUser;
    });

    const publicPictures = computed(() => {
      return store.state.pictures.publicPictures;
    });

    const swiperOptions = {
      loop: true,
    };

    onMounted(() => {
      store.dispatch(ActionTypes.GET_PUBLIC_PICTURES);
    });

    return {
      swiperComponentRef,
      currentUser,
      swiperOptions,
      publicPictures,
    };
  },
});
</script>

<style lang="scss" scoped>
main {
  width: 100%;

  .swiper {
    width: 100%;
    height: 80vh;
  }

  p {
    width: 40ch;
  }

  .picture {
    text-align: center;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
