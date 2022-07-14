import Vue from 'vue';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import countriesSelectionOptions from '../assets/json/countries.json';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
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
  'timeConverterToStringifiedDate', (date : string) => {
    if (date) {
      return dayjs(date).locale(window.i18nSettings.languageLocale).format('LLLL');
    }
    return '-';
  });

Vue.filter(
  'timeConverterToHour', (timestamp : string) => {
    if (timestamp) {
      return new Date(timestamp).toLocaleTimeString(
        window.i18nSettings.languageLocale,
        {
          hour: '2-digit',
          minute: '2-digit',
        },
      );
    }
    return '-';
  });

Vue.filter(
  'changeCountriesCodesToNames', (countries : Array<string>) => countries.map((country) => {
    for (let i = 0; i < countriesSelectionOptions.length; i += 1) {
      if (country === countriesSelectionOptions[i].code) {
        return countriesSelectionOptions[i].country;
      }
    }

    return country;
  }));

Vue.filter(
  'formatPrice', (value: number, currencyCode?: string) => {
    if (!currencyCode?.length) {
      console.warn('No currency code provided when formating price');
      return value;
    }

    return Intl.NumberFormat(window.i18nSettings.languageLocale, {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  });

Vue.filter(
  'changeCountriesNamesToCodes', (countries : Array<string>) => countries.map((country) => {
    for (let i = 0; i < countriesSelectionOptions.length; i += 1) {
      if (country === countriesSelectionOptions[i].country) {
        return countriesSelectionOptions[i].code;
      }
    }

    return country;
  }));

Vue.filter(
  'slugify', (...args: (string | number)[]): string => {
    const value = args.join(' ');

    return value
      .normalize('NFD') // split an accented letter in the base letter and the acent
      .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
      .replace(/\s+/g, '-'); // separator
  });
