<template>
  <b-button
    id="datepicker"
  >
    tutu
  </b-button>
</template>

<script>
import LitePicker from "litepicker";
import 'litepicker/dist/plugins/keyboardnav';
import 'litepicker/dist/plugins/mobilefriendly';

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
      // singleMode: false,
      tooltipText: {
        one: 'day',
        other: 'days'
      },
      tooltipNumber: (totalDays) => {
        return totalDays - 1;
      },
      plugins: ['keyboardnav', 'mobilefriendly'],
      // autoApply: true,
      singleMode: false,
      numberOfColumns: 2,
      numberOfMonths: 2,
      showWeekNumbers: true,
      mobileFriendly: true,
      minDate: new Date(),
      dropdowns: { months: true, years: true },
      lang: window.i18nSettings.languageLocale.split('-')[0],
      resetButton: true,
    });
  },
};
</script>
