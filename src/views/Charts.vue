<template>
  <main>
    <bar-chart v-if="isDataLoaded" :config="barChartConfig"></bar-chart>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BarChart from "../components/charts/BarChart.vue";

export default defineComponent({
  components: {
    BarChart,
  },
  setup() {
    const barChartConfig = {
      data: null,
      width: 800,
      height: 450,
      title: "Daily visits",
      leftAxisLabel: "Visits",
      bottomAxisLabel: "Time",
      labelFontSize: "14",
      titleFontSize: "1em",
      bandColor: "var(--color-success-light)",
      labelColor: "var(--white)",
    };
    const isDataLoaded = ref(false);

    function fetchVisits() {
      return fetch(
        "http://localhost:3000/api/analytics/getEventsByType?type=ROUTE_CHANGE"
      ).then((res) => res.json());
    }

    onMounted(() =>
      fetchVisits()
        .then((visits) => {
          return visits.reduce((acc: any, event: any) => {
            const key = new Date(event.timestamp).toDateString();
            if (key in acc) {
              acc[key] += 1;
            } else acc[key] = 1;
            return acc;
          }, {});
        })
        .then((mappedVisits) => {
          isDataLoaded.value = true;
          barChartConfig.data = mappedVisits;
        })
    );

    return {
      isDataLoaded,
      barChartConfig,
    };
  },
});
</script>

<style lang="scss" scoped>
main {
  width: 100%;
}
</style>
