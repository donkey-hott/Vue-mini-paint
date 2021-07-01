<template>
  <main v-if="isDataLoaded">
    <bar-chart :data="barChartData" :config="barChartConfig"></bar-chart>
    <pie-chart :data="pieChartData" :config="pieChartConfig"></pie-chart>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BarChart from "../components/charts/BarChart.vue";
import {
  BarChartConfig,
  PieChartConfig,
} from "../components/charts/ChartTypes";
import PieChart from "../components/charts/PieChart.vue";

export default defineComponent({
  components: {
    BarChart,
    PieChart,
  },
  setup() {
    const barChartData = ref<{ [key: string]: number } | null>(null);
    const barChartConfig: BarChartConfig = {
      height: 500,
      title: "Daily visits",
      leftAxisLabel: "Visits",
      bottomAxisLabel: "Time",
      labelFontSize: "14",
      titleFontSize: "1em",
      bandColor: "var(--color-success-light)",
      labelColor: "var(--white)",
    };

    const pieChartData = ref<{ [key: string]: number } | null>(null);
    const pieChartConfig: PieChartConfig = {
      title: "Page distribution by visits",
      titleColor: "#ffffff",
      titleSize: 18,
      labelColor: "#ffffff",
      labelSize: 16,
      responsive: true,
      backgroundColors: [
        "#D83A56",
        "#FF616D",
        "#FFEAC9",
        "#66DE93",
        "#5F939A",
        "#3A6351",
        "#04009A",
        "#3EDBF0",
        "#FFD8CC",
        "#0A1D37",
      ],
    };

    const isDataLoaded = ref(false);

    function fetchVisits() {
      console.log(process.env);
      return fetch(
        `${process.env.VUE_APP_SERVER_HOST}/api/analytics/getEventsByType?type=ROUTE_CHANGE`
      ).then((res) => res.json());
    }

    function aggregateData(
      dataset: Array<{ [key: string]: string }>,
      targetField: string
    ) {
      return dataset.reduce((acc: { [key: string]: number }, event) => {
        let key = isNaN(Date.parse(event[targetField]))
          ? event[targetField]
          : new Date(event[targetField]).toDateString();

        if (key in acc) {
          acc[key] += 1;
        } else acc[key] = 1;
        return acc;
      }, {});
    }

    onMounted(() =>
      fetchVisits()
        .then((visits) => {
          return {
            visitsByTime: aggregateData(visits, "timestamp"),
            visitsByPage: aggregateData(visits, "route"),
          };
        })
        .then((mappedData) => {
          barChartData.value = mappedData.visitsByTime;
          pieChartData.value = mappedData.visitsByPage;
          isDataLoaded.value = true;
        })
    );

    return {
      isDataLoaded,
      barChartData,
      barChartConfig,
      pieChartData,
      pieChartConfig,
    };
  },
});
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
</style>
