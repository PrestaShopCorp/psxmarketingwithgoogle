export default function stringToNumber(value: any): any {
  if (!Number.isNaN(value) && !Number.isNaN(parseFloat(value))) {
    return Number(value);
  }
  return value;
}
