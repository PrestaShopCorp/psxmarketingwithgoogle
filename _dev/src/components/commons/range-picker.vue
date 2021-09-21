<template>
  <div
    id="datepicker"
  />
</template>

<script>
import LitePicker from "litepicker";

export default {
  name: 'RangePicker',
  data() {
    return {
      minDate: null,
      maxDate: null,
    }
  },
  mounted() {
    new Litepicker({
      element: document.getElementById('datepicker'),
      singleMode: false,
      tooltipText: {
        one: 'day',
        other: 'days'
      },
      tooltipNumber: (totalDays) => {
        return totalDays - 1;
      }
    });
  },
};
</script>

<style lang="sass">
  .litepicker {
    display: block !important
  }
</style>
