export function getDataFromLocalStorage(key: string) {
  try {
    const data = localStorage.getItem(key);
    if (data !== 'undefined' && data !== null) {
      return JSON.parse(data);
    }
    return null;
  } catch (error: any) {
    localStorage.removeItem(key);
    return null;
  }
}

export default {getDataFromLocalStorage};
