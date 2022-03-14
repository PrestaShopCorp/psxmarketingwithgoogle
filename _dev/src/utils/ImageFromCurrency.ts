export function searchImage(currency : string, size: number) {
  if (size === 1) {
    if (currency.toUpperCase() === 'ZL') {
      return 'banner/ads-poland-big.png';
    }
    if (currency.toUpperCase() === 'USD') {
      return 'banner/ads-dollars-big.png';
    }
    if (currency.toUpperCase() === 'EUR') {
      return 'banner/ads-euro-big.png';
    }
    return 'banner/ads-dollars-big.png';
  }

  if (currency.toUpperCase() === 'ZL') {
    return 'banner/ads-poland.png';
  }
  if (currency.toUpperCase() === 'USD') {
    return 'banner/ads-dollars.png';
  }
  if (currency.toUpperCase() === 'EUR') {
    return 'banner/ads-euro.png';
  }
  return 'banner/ads-dollars.png';
}

export default {searchImage};
