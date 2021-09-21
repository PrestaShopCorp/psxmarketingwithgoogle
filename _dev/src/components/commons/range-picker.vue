<template>
  <b-button
    id="datepicker"
  >
    {{
      startDate === null ? 'Select a date' : startDate + ' ' + endDate
    }}
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
      startDate: null,
      endDate: null,
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
      autoApply: true,
      singleMode: false,
      numberOfColumns: 2,
      numberOfMonths: 2,
      showWeekNumbers: true,
      mobileFriendly: true,
      minDate: new Date(),
      dropdowns: { months: true, years: true },
      lang: window.i18nSettings.languageLocale.split('-')[0],
      resetButton: true,
      setup: (picker) => {
        picker.on("selected", (date1, date2) => {
          const startDate = dayjs(date1.dateInstance)
            .locale(store.state.main.isoCode)
            .format("YYYY-MM-DD");
          const endDate = dayjs(date2.dateInstance)
            .locale(store.state.main.isoCode)
            .format("YYYY-MM-DD");
          this.startDate = startDate;
          this.endDate = endDate;
        });
      },
    });
  },
};
</script>
