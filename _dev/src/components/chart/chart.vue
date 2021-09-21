<template>
  <canvas ref="chartRef"></canvas>
</template>

<script>
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "Chart",
  props: {
    type: {
      type: String,
      required: false,
      default: "line",
      validator: (value) => {
        return ["line", "bar", "radar", "doughnut", "pie"].indexOf(value) !== -1;
      },
    },
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    width: {
      type: Number,
      required: false,
      default: 0,
    },
    height: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  methods: {
    createChart() {
      const canvas = this.$refs.chartRef.getContext('2d');

      new Chart(canvas, {
        type: this.type,
        data: this.data,
        options: this.options,
      });
    },
  },
  mounted() {
    this.createChart();
  },
  watch: {
    data: {
      deep: true,
      handler() {
        const chart = Chart.getChart(this.$refs.chartRef.getContext('2d'));
        if (chart !== undefined) {
          chart.data = this.data;
          chart.update();
        }
      },
    },
  },
};
</script>
