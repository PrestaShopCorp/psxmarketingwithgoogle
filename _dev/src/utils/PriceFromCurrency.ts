export function searchPrice(currency : string) {
  if (currency.toUpperCase() === 'PLN') {
    return '1200zł';
  }
  if (currency.toUpperCase() === 'GBP') {
    return '£400';
  }
  if (currency.toUpperCase() === 'USD') {
    return '$500';
  }
  if (currency.toUpperCase() === 'EUR') {
    return '400€';
  }
  return '$500';
}

export default {searchPrice};
