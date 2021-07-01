<template>
  <div id="bar-chart"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
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
    let chart: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    const xScale = ref<d3.ScaleBand<string> | undefined>();
    const yScale = ref<d3.ScaleLinear<number, number, never> | undefined>();
    const tooltip = ref<{
      wrapper: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
      text: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
    }>();

    const MARGIN = 70;
    let width = props.config.width ?? 800;
    let height = props.config.height ?? 450;
    width -= MARGIN * 2;
    height -= MARGIN * 2;

    function renderXAxis(data: { [key: string]: number }) {
      const xRange = width - MARGIN;
      const xScale = d3
        .scaleBand()
        .range([0, xRange])
        .domain(Object.keys(data))
        .padding(0.1);
      chart
        .append("g")
        .call(d3.axisBottom(xScale))
        .attr("transform", `translate(${MARGIN}, ${height - MARGIN / 2})`);

      return xScale;
    }

    function renderYAxis(data: { [key: string]: number }) {
      const yRange = height - MARGIN;
      const yScale = d3
        .scaleLinear()
        .range([yRange, 0])
        .domain([0, d3.max(Object.values(data)) as number]);

      chart
        .append("g")
        .attr("transform", `translate(${MARGIN}, ${MARGIN / 2})`)
        .call(d3.axisLeft(yScale).tickSize(-width + MARGIN));

      return yScale;
    }

    function renderChartTitle() {
      d3.select("svg")
        .append("text")
        .attr("x", width / 2)
        .attr("y", MARGIN / 3)
        .attr("text-anchor", "middle")
        .attr("fill", props.config.labelColor || "#000000")
        .attr("font-size", props.config.titleFontSize || "1em")
        .text(props.config.title || "");
    }

    function renderLeftAxisLabel() {
      d3.select("svg")
        .append("text")
        .attr("fill", props.config.labelColor || "#000000")
        .attr("font-size", props.config.labelFontSize || "1em")
        .attr("font-style", "italic")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", MARGIN / 2)
        .attr("text-anchor", "middle")
        .text(props.config.leftAxisLabel || "");
    }

    function renderBottomAxisLabel() {
      d3.select("svg")
        .append("text")
        .attr("fill", props.config.labelColor || "#000000")
        .attr("font-size", props.config.labelFontSize || "1em")
        .attr("font-style", "italic")
        .attr("x", width / 2)
        .attr("y", height)
        .attr("text-anchor", "middle")
        .text(props.config.bottomAxisLabel || "");
    }

    function renderBands(
      xScale: d3.ScaleBand<string> | undefined,
      yScale: d3.ScaleLinear<number, number, never> | undefined,
      data: { [key: string]: number }
    ) {
      if (!xScale || !yScale) return;
      const barGroups = chart
        .selectAll()
        .data(Object.entries(data))
        .enter()
        .append("g");

      barGroups
        .append("rect")
        .attr("x", ([key, value]) => (xScale(key) as number) + MARGIN)
        .attr("y", ([key, value]) => yScale(value) + MARGIN / 2)
        .attr("width", xScale.bandwidth())
        .attr("height", ([key, value]) => height - yScale(value) - MARGIN)
        .attr("fill", props.config.bandColor || "#000000");

      return barGroups;
    }

    function renderTooltip() {
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

      return {
        wrapper: tooltipWrapper,
        text: tooltipText,
      };
    }

    function showTooltip(event: MouseEvent, key: string, value: number) {
      if (!tooltip.value || !yScale.value || !xScale.value) return;
      tooltip.value.text.text(value);

      const y = yScale.value(value);
      const x =
        (xScale.value(key) as number) + MARGIN + xScale.value.bandwidth() / 2;
      tooltip.value.wrapper
        .transition()
        .duration(200)
        .attr("opacity", 1)
        .attr("transform", `translate(${x} ${y})`);
    }

    function hideTooltip() {
      if (!tooltip.value) return;
      tooltip.value?.wrapper.transition().duration(200).attr("opacity", 0);
    }

    function build(data: typeof props.data) {
      if (data === null) {
        throw new TypeError("Bar chart data cannot be typeof null");
      }

      chart = d3
        .select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

      /* axes */
      xScale.value = renderXAxis(data);
      yScale.value = renderYAxis(data);

      /* labels */
      renderChartTitle();
      renderLeftAxisLabel();
      renderBottomAxisLabel();

      /* bands and tooltip */
      const bands = renderBands(xScale.value, yScale.value, data);
      tooltip.value = renderTooltip();

      bands?.on("mouseenter", (e, [key, value]) => showTooltip(e, key, value));
      bands?.on("mouseout", () => hideTooltip());
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
