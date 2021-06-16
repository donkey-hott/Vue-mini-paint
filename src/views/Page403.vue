<template>
  <main>
    <div class="main-message-wrapper">
      <h2>403</h2>
      <strong>Forbidden</strong>
    </div>
    <p>You do not have permission for this request</p>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();

    onMounted(() => {
      if (!route.redirectedFrom) {
        router.push("/");
      }
    });
  },
});
</script>

<style lang="scss" scoped>
main {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .main-message-wrapper {
    background: var(--color-danger);
    padding: 0.5em 0;
    margin-bottom: 0.5em;
    border-radius: var(--btn-border-radius);

    h2 {
      font-size: calc(var(--text-xxl) * 2);
    }
  }
}
</style>
