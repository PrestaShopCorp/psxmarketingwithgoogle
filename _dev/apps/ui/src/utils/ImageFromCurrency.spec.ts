/* eslint-disable */

/**
 * @vitest-environment jsdom
 */

 import  {getPathToAdsPromotionImage} from "./ImageFromCurrency";

 describe("Retrieve image from currency shop - ImageFromCurrency", () => {

    it("returns image in euro if french", () => {
      const source = 'EUR'
      const result = getPathToAdsPromotionImage(source);
      expect(result).toEqual('/src/assets/images/banner/ads-euro.svg');
    })
    it("returns image in pounds if english", () => {
      const source = 'GBP'
      const result = getPathToAdsPromotionImage(source);
      expect(result).toEqual('/src/assets/images/banner/ads-pounds.svg');
    })
    it("returns image in dollars if usd", () => {
      const source = 'USD'
      const result = getPathToAdsPromotionImage(source);
      expect(result).toEqual('/src/assets/images/banner/ads-dollars.svg');
    })
    it("returns image in zloty if polish", () => {
      const source = 'PLN'
      const result = getPathToAdsPromotionImage(source);
      expect(result).toEqual('/src/assets/images/banner/ads-zloty.svg');
    })
    it("returns image fallback if currency not found", () => {
      const source = 'AZERTY'
      const result = getPathToAdsPromotionImage(source);
      expect(result).toEqual('/src/assets/images/banner/ads-dollars.svg');
    })
});
