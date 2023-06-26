import adsPromotionZloty from '@/assets/images/banner/ads-zloty.svg';
import adsPromotionPounds from '@/assets/images/banner/ads-pounds.svg';
import adsPromotionDollars from '@/assets/images/banner/ads-dollars.svg';
import adsPromotionEuro from '@/assets/images/banner/ads-euro.svg';


export function getPathToAdsPromotionImage(currency : string) {
  if (currency.toUpperCase() === 'PLN') {
    return adsPromotionZloty;
  }
  if (currency.toUpperCase() === 'GBP') {
    return adsPromotionPounds;
  }
  if (currency.toUpperCase() === 'USD') {
    return adsPromotionDollars;
  }
  if (currency.toUpperCase() === 'EUR') {
    return adsPromotionEuro;
  }
  return adsPromotionDollars;
}

export default {getPathToAdsPromotionImage};
