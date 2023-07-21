export function getPathToAdsPromotionImage(currency : string) {
  if (currency.toUpperCase() === 'PLN') {
    return new URL('@/assets/images/banner/PS_MARKETING_VOUCHER_ZLOTY.png', import.meta.url).href;
  }
  if (currency.toUpperCase() === 'EUR') {
    return new URL('@/assets/images/banner/PS_MARKETING_VOUCHER_EURO.png', import.meta.url).href;
  }
  return new URL('@/assets/images/banner/PS_MARKETING_VOUCHER_DOLLAR.png', import.meta.url).href;
}

export default {getPathToAdsPromotionImage};
