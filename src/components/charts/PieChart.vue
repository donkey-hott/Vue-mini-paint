<template>
  <div id="chart-container">
    <canvas ref="chartElem" height="450" width="500"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType } from "vue";
import { Chart, registerables } from "chart.js";
import { PieChartConfig } from "./ChartTypes";
Chart.register(...registerables);

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<{ [key: string]: number } | null>,
      required: true,
    },
    config: {
      type: Object as PropType<PieChartConfig>,
      required: false,
    },
  },
  setup(props) {
    const chartElem = ref<HTMLCanvasElement | null>(null);

    function build(data: typeof props.data) {
      if (!chartElem.value) {
        throw new Error("Rendering context must be provided");
      }

      if (!data) {
        throw new TypeError("Invalid or unprovided pie chart data");
      }

      return new Chart(chartElem.value, {
        type: "pie",
        options: {
          responsive: props.config?.responsive,
          plugins: {
            legend: {
              labels: {
                color: props.config?.labelColor,
                font: {
                  size: props.config?.labelSize,
                },
              },
            },
            title: {
              display: true,
              text: props.config?.title,
              color: props.config?.titleColor,
              font: {
                size: props.config?.titleSize,
              },
            },
          },
        },
        data: {
          labels: Object.keys(data),
          datasets: [
            {
              data: Object.values(data),
              backgroundColor: props.config?.backgroundColors,
            },
          ],
        },
      });
    }

    onMounted(() => {
      build(props.data);
    });

    return { chartElem };
  },
});
</script>

<style lang="scss" scoped>
#chart-container {
  width: 40%;
  height: 80vh;
  margin-top: 2em;
}
</style>
