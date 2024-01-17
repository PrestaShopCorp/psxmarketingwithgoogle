<template>
  <canvas
    ref="chartRef"
    :width="`${width}px`"
    :height="`${height}px`"
  />
</template>

<script>
import {Chart, registerables} from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

export default {
  name: 'ChartCanvas',
  props: {
    type: {
      type: String,
      required: false,
      default: 'line',
      validator: (value) => ['line', 'bar', 'radar', 'doughnut', 'pie'].indexOf(value) !== -1,
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

      return new Chart(canvas, {
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
          chart.destroy();
          this.createChart();
        }
      },
    },
  },
};
</script>
