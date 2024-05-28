export default function debounce<T extends(...args: any[]) => any>(fn: T, delay: number): T {
  let timeoutID: ReturnType<typeof setTimeout>;

  // eslint-disable-next-line func-names
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  } as T;
}
