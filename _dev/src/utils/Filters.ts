import Vue from 'vue';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import utc from 'dayjs/plugin/utc';
import countriesSelectionOptions from '../assets/json/countries.json';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/London');

Vue.filter(
  'timeConverterToDate', (timestamp : string) => {
    if (timestamp) {
      const a = new Date(timestamp);
      const year = a.getFullYear();
      const month = a.getMonth() + 1;
      const finalMonth = month < 10 ? `0${month}` : month;
      const day = a.getDate();
      const finalDay = day < 10 ? `0${day}` : day;
      const time = `${finalDay}/${finalMonth}/${year}`;
      return time;
    }
    return '-';
  });

Vue.filter(
  'timeConverterToHour', (timestamp : string) => {
    if (timestamp) {
      const a = dayjs.tz(timestamp);
      const hour = a.hour();
      const min = a.minute();
      const finalMin = min < 10 ? `0${min}` : min;
      const time = `${hour}:${finalMin}`;
      return time;
    }
    return '-';
  });

Vue.filter(
  'changeCountryCodeToName', (country : string) => {
    const final : string[] = [];
    for (let i = 0; i < countriesSelectionOptions.length; i += 1) {
      if (country[0] === countriesSelectionOptions[i].code) {
        final.push(countriesSelectionOptions[i].country);
        break;
      }
    }
    return final;
  });
