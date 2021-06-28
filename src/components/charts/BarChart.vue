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
        "Mon Jun 28 2021": 100,
        "Mon Jun 21 2021": 84,
      };
      const margin = 70;
      const width = 800 - 2 * margin;
      const height = 450 - 2 * margin;
      const chart = d3
        .select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

      /* RENDER Y-AXIS */
      const yRange = height - margin;
      const yScale = d3
        .scaleLinear()
        .range([yRange, 0])
        .domain([0, d3.max(Object.values(data)) as number]);
      chart
        .append("g")
        .attr("transform", `translate(${margin}, ${margin / 2})`)
        .call(d3.axisLeft(yScale).tickSize(-width + margin));

      /* RENDER X-AXIS */
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

      /* RENDER BARS */
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

      /* RENDER LABELS */

      d3.select("svg")
        .append("text")
        .attr("x", (width + margin) / 2)
        .attr("y", margin / 3)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "1em")
        .text("Daily visitors");

      d3.select("svg")
        .append("text")
        .attr("fill", "white")
        .attr("font-size", 14)
        .attr("font-style", "italic")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", margin / 2)
        .attr("text-anchor", "middle")
        .text("Visits");

      d3.select("svg")
        .append("text")
        .attr("fill", "white")
        .attr("font-size", 14)
        .attr("font-style", "italic")
        .attr("x", (width + margin) / 2)
        .attr("y", height)
        .attr("text-anchor", "middle")
        .text("Time");
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
