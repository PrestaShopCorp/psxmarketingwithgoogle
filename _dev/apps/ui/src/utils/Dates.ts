import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.tz.setDefault('Europe/London');

export const timeConverterToDate = (date?: string|Date) => {
  if (date) {
    return new Date(date).toLocaleDateString(
      window.i18nSettings.languageLocale.substring(0, 2),
    );
  }
  return '-';
};

export const timeConverterToStringifiedDate = (date?: string|Date) => {
  if (date) {
    return dayjs(date)
      .locale(window.i18nSettings.languageLocale)
      .format('LLLL');
  }
  return '-';
};

export const timeConverterToHour = (date?: string|Date) => {
  if (date) {
    return new Date(date).toLocaleTimeString(
      window.i18nSettings.languageLocale.substring(0, 2),
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  }
  return '-';
};
