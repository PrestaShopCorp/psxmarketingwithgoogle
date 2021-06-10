import Vue from 'vue';

Vue.filter(
  'timeConverterToDate', (timestamp : string) => {
    const a = new Date(timestamp);
    const year = a.getFullYear();
    const month = a.getMonth();
    const finalMonth = month < 10 ? `0${month}` : month;
    const day = a.getDate();
    const finalDay = day < 10 ? `0${finalDay}` : day;
    const time = `${day}/${finalMonth}/${year}`;
    return time;
  });

Vue.filter(
  'timeConverterToHour', (timestamp : string) => {
    const a = new Date(timestamp);
    const hour = a.getHours();
    const min = a.getMinutes();
    const finalMin = min < 10 ? `0${min}` : min;
    const time = `${hour}:${finalMin}`;
    return time;
  });
