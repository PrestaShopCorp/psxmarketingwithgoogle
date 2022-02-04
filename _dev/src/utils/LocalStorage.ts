import * as Sentry from '@sentry/vue';

export function getDataFromLocalStorage(key: string) {
  try {
    const data = localStorage.getItem(key);

    if (data !== 'undefined' && data !== null) {
      return JSON.parse(data);
    }
    return null;
  } catch (error: any) {
    localStorage.removeItem(key);
    Sentry.captureException(new Error(error));
    return null;
  }
}

export default {getDataFromLocalStorage};
