export function stringToBoolean(value: any): any {
  if (typeof value !== 'string') {
    return value;
  }
  if (value.toLowerCase() === 'true') {
    return true;
  }
  if (value.toLowerCase() === 'false') {
    return false;
  }
  return value;
}

export function booleanToString(value: any): any {
  if (value === true) {
    return 'true';
  }

  if (value === false) {
    return 'false';
  }

  return value;
}

export default {stringToBoolean, booleanToString};
