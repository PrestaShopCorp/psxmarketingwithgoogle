import Vue from 'vue';

import dayjs from 'dayjs';
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin
const utc = require('dayjs/plugin/utc');

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
  'changeCountryCodeToName', (countriesGiven : Array<string>, totalCountries : Array<{code: string; country: string}>) => {
    const final : string[] = [];
    countriesGiven.map((data) => {
      for (let i = 0; i < totalCountries.length; i += 1) {
        if (data === totalCountries[i].code) {
          final.push(totalCountries[i].country);
          break;
        }
      }
      return final;
    });
    return final;
  });
