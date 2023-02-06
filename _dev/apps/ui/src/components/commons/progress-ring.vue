<template>
  <svg
    class="ps_progress-ring"
    :height="radius * 2"
    :width="radius * 2"
  >
    <circle
      :stroke-width="stroke"
      fill="transparent"
      :r="normalizedRadius"
      :cx="radius"
      :cy="radius"
    />
    <circle
      fill="transparent"
      :stroke-dasharray="circumference + ' ' + circumference"
      :style="{ strokeDashoffset: strokeDashoffset }"
      :stroke-width="stroke"
      :r="normalizedRadius"
      :cx="radius"
      :cy="radius"
    />
  </svg>
</template>

<script>
export default {
  name: 'ProgressRing',
  props: {
    radius: {
      type: Number,
      required: false,
      default: 0,
    },
    progress: {
      type: Number,
      required: false,
      default: 0,
    },
    stroke: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    const normalizedRadius = this.radius - this.stroke;
    const circumference = normalizedRadius * 2 * Math.PI;

    return {
      normalizedRadius,
      circumference,
    };
  },
  computed: {
    strokeDashoffset() {
      return this.circumference - (this.progress / 100) * this.circumference;
    },
  },
};
</script>
