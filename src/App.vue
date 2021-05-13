<template>
  <the-header></the-header>
  <router-view />
</template>

<script lang="ts">
import TheHeader from "./components/UI/TheHeader.vue";
import { defineComponent, onMounted } from "vue";
import { PictureLoaderObserver } from "./utils/observer/observers";
import { ScrollPublisher } from "./utils/observer/publisher";

export default defineComponent({
  components: {
    TheHeader,
  },

  setup() {
    let scrollPublisher = new ScrollPublisher();
    let pictureLoaderObserver = new PictureLoaderObserver();

    function initObserver() {
      scrollPublisher.subscribe(pictureLoaderObserver);

      document.addEventListener("scroll", () => {
        scrollPublisher.handleScrollEnd();
      });
    }

    onMounted(() => initObserver());
  },
});
</script>

<style lang="scss">
@import "./assets/colors.scss";

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font-size: 100%;
}
html,
body,
#app {
  height: 100%;
}

#app {
  font-family: "Nunito Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $dark-contrast;
  background: $dark-background;
  font-size: 16px;
}

select,
input {
  font-size: inherit;
  font-family: inherit;
}

input {
  background: transparent;
  border: 0;
  color: #fff;
}

@media (min-width: 767px) {
  #app {
    font-size: 20px;
  }
}
</style>
