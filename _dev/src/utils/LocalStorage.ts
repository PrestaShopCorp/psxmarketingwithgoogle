export default function getDataFromLocalStorage(key: string) {
  try {
    const data = localStorage.getItem(key);
    if (data !== 'undefined' && data !== null) {
      return JSON.parse(data);
    }
    return null;
  } catch (error: any) {
    localStorage.removeItem(key);
    throw error;
  }
}
