<template>
  <div id="bar-chart"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import * as d3 from "d3";

export default defineComponent({
  setup() {
    function build(data: { [key: string]: number }) {
      data = {
        "Thu Jun 24 2021": 6,
        "Sun Jun 27 2021": 96,
        "Sat Jun 26 2021": 124,
      };
      const margin = 50;
      const width = 800 - 2 * margin;
      const height = 450 - 2 * margin;
      const chart = d3
        .select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

      const yRange = height - margin;
      const yScale = d3
        .scaleLinear()
        .range([yRange, 0])
        .domain([0, d3.max(Object.values(data)) as number]);
      chart
        .append("g")
        .attr("transform", `translate(${margin}, ${margin / 2})`)
        .call(d3.axisLeft(yScale).tickSize(-width));

      const xRange = width - margin;
      const xScale = d3
        .scaleBand()
        .range([0, xRange])
        .domain(Object.keys(data))
        .padding(0.1);
      chart
        .append("g")
        .call(d3.axisBottom(xScale))
        .attr("transform", `translate(${margin}, ${height - margin / 2})`);
      chart
        .selectAll("rect")
        .data(Object.entries(data))
        .enter()
        .append("rect")
        .attr("x", ([date, _]) => (xScale(date) as number) + margin)
        .attr("y", ([_, times]) => yScale(times) + margin / 2)
        .attr("width", xScale.bandwidth())
        .attr("height", ([_, times]) => height - yScale(times) - margin)
        /* TODO: get rid of scss variables; pass configuration via props */
        .attr("fill", "var(--color-success-light)");
    }

    function getData() {
      return fetch(
        "http://localhost:3000/api/analytics/getEventsByType?type=ROUTE_CHANGE"
      ).then((res) => res.json());
    }

    onMounted(() =>
      getData()
        .then((data) => {
          return data.reduce((acc: any, event: any) => {
            const key = new Date(event.timestamp).toDateString();
            if (key in acc) {
              acc[key] += 1;
            } else acc[key] = 1;
            return acc;
          }, {});
        })
        .then((handledData) => build(handledData))
    );
  },
});
</script>

<style lang="scss" scoped>
#bar-chart {
  width: 75%;
}
</style>
