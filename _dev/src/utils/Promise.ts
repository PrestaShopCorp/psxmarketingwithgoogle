export const runIf = async (condition: boolean, promise: Promise<any>) => {
  if (condition) {
    return promise;
  }
  return () => {};
};

export default {
  runIf,
};
