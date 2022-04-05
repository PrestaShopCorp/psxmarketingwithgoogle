export function searchImage(currency : string) {
  if (currency.toUpperCase() === 'PLN') {
    return 'banner/ads-poland.svg';
  }
  if (currency.toUpperCase() === 'GBP') {
    return 'banner/ads-pounds.svg';
  }
  if (currency.toUpperCase() === 'USD') {
    return 'banner/ads-dollars.svg';
  }
  if (currency.toUpperCase() === 'EUR') {
    return 'banner/ads-euro.svg';
  }
  return 'banner/ads-dollars.svg';
}

export default {searchImage};
