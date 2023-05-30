import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.tz.setDefault('Europe/London');

export const timeConverterToDate = (timestamp: string) => {
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
