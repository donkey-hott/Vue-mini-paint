<template>
  <div id="bar-chart"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from "vue";
import * as d3 from "d3";
import { BarChartConfig } from "./ChartTypes";

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<{ [key: string]: number } | null>,
      required: true,
    },
    config: {
      type: Object as PropType<BarChartConfig>,
      required: true,
    },
  },
  setup(props) {
    function build(data: typeof props.data) {
      if (data === null) {
        throw new TypeError("barChartData cannot be typeof null");
      }
      const margin = 70;
      let width = props.config.width ?? 800;
      let height = props.config.height ?? 450;
      width -= margin * 2;
      height -= margin * 2;

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

      /* RENDER LABELS */

      d3.select("svg")
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin / 3)
        .attr("text-anchor", "middle")
        .attr("fill", props.config.labelColor || "#000000")
        .attr("font-size", props.config.titleFontSize || "1em")
        .text(props.config.title || "");

      d3.select("svg")
        .append("text")
        .attr("fill", props.config.labelColor || "#000000")
        .attr("font-size", props.config.labelFontSize || "1em")
        .attr("font-style", "italic")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", margin / 2)
        .attr("text-anchor", "middle")
        .text(props.config.leftAxisLabel || "");

      d3.select("svg")
        .append("text")
        .attr("fill", props.config.labelColor || "#000000")
        .attr("font-size", props.config.labelFontSize || "1em")
        .attr("font-style", "italic")
        .attr("x", width / 2)
        .attr("y", height)
        .attr("text-anchor", "middle")
        .text(props.config.bottomAxisLabel || "");

      /* RENDER BARS AND TOOLTIP*/

      const barGroups = chart
        .selectAll()
        .data(Object.entries(data))
        .enter()
        .append("g");

      const tooltipWrapper = chart.append("g").attr("opacity", 0);
      tooltipWrapper
        .append("polygon")
        .attr("id", "tooltip")
        .attr("fill", "#cecece")
        .attr("points", "0, 0, 60, 0, 60, 30, 40, 30, 30, 40, 20, 30, 0, 30");
      const tooltipText = tooltipWrapper
        .append("text")
        .attr("fill", "#ffffff")
        .attr("text-anchor", "middle")
        .attr("x", "4.5%")
        .attr("y", "5%")
        .attr("dominant-baseline", "middle");

      barGroups
        .append("rect")
        .attr("x", ([key, value]) => (xScale(key) as number) + margin)
        .attr("y", ([key, value]) => yScale(value) + margin / 2)
        .attr("width", xScale.bandwidth())
        .attr("height", ([key, value]) => height - yScale(value) - margin)
        .attr("fill", props.config.bandColor || "#000000")
        .on("mouseenter", (event: MouseEvent, [key, value]) => {
          tooltipText.text(value);

          const y = yScale(value);
          const x = (xScale(key) as number) + margin + xScale.bandwidth() / 2;
          tooltipWrapper
            .transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("transform", `translate(${x} ${y})`);
        })
        .on("mouseout", () => {
          tooltipWrapper.transition().duration(200).attr("opacity", 0);
        });
    }
    onMounted(() => build(props.data));
  },
});
</script>

<style lang="scss" scoped>
#bar-chart {
  width: 75%;
}
</style>
