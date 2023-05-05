import Vue from 'vue';

import {changeCountriesCodesToNames} from './Countries';
import {formatPrice} from './Price';
import {timeConverterToDate, timeConverterToHour, timeConverterToStringifiedDate} from './Dates';

Vue.filter('timeConverterToDate', timeConverterToDate);

Vue.filter('timeConverterToStringifiedDate', timeConverterToStringifiedDate);

Vue.filter('timeConverterToHour', timeConverterToHour);

Vue.filter('changeCountriesCodesToNames', changeCountriesCodesToNames);

Vue.filter('formatPrice', formatPrice);

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
