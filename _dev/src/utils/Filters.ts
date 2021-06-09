import Vue from 'vue';

Vue.filter(
  'timeConverterToDate', (timestamp : string) => {
    const a = new Date(timestamp);
    const year = a.getFullYear();
    let month = a.getMonth();
    month = month < 10 ? `0${month}` : month;
    let day = a.getDate();
    day = day < 10 ? `0${day}` : day;
    const time = `${day}/${month}/${year}`;
    return time;
  });

Vue.filter(
  'timeConverterToHour', (timestamp : string) => {
    const a = new Date(timestamp);
    const hour = a.getHours();
    let min = a.getMinutes();
    min = min < 10 ? `0${min}` : min;
    const time = `${hour}:${min}`;
    return time;
  });
