<template>
  <main>
    <bar-chart></bar-chart>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BarChart from "../components/charts/BarChart.vue";

export default defineComponent({
  components: {
    BarChart,
  },
});
</script>

<style lang="scss" scoped>
main {
  width: 100%;
}
</style>
