<template>
  <main v-if="isDataLoaded">
    <bar-chart :config="barChartConfig"></bar-chart>
    <pie-chart :config="pieChartConfig"></pie-chart>
  </main>
</template>

<script lang="ts">
import { useStore } from "../store";
import { ActionTypes } from "@/store/modules/analytics/actions/action-types";
import { MutationTypes } from "@/store/modules/analytics/mutations/mutation-types";
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
    const store = useStore();
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

    onMounted(() => {
      store.dispatch(ActionTypes.FETCH_VISITS).then((visits) => {
        store.commit(
          MutationTypes.SET_VISITS_BY_TIME,
          aggregateData(visits, "timestamp")
        );
        store.commit(
          MutationTypes.SET_VISITS_BY_PAGES,
          aggregateData(visits, "route")
        );
        isDataLoaded.value = true;
      });
    });

    return {
      isDataLoaded,
      barChartConfig,
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
