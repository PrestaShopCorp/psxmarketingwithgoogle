/* eslint-disable */


 import  {getPathToAdsPromotionImage} from "./ImageFromCurrency";

 describe("Retrieve image from currency shop - ImageFromCurrency", () => {

    it("returns image in euro if french", () => {
      const source = 'EUR'
      const result = getPathToAdsPromotionImage(source);
      expect(result).toMatch('assets/images/banner/PS_MARKETING_VOUCHER_EURO.png');
    })
    it("returns image in pounds if english", () => {
      const source = 'GBP'
      const result = getPathToAdsPromotionImage(source);
      expect(result).toMatch('assets/images/banner/PS_MARKETING_VOUCHER_DOLLAR.png');
    })
    it("returns image in dollars if usd", () => {
      const source = 'USD'
      const result = getPathToAdsPromotionImage(source);
      expect(result).toMatch('assets/images/banner/PS_MARKETING_VOUCHER_DOLLAR.png');
    })
    it("returns image in zloty if polish", () => {
      const source = 'PLN'
      const result = getPathToAdsPromotionImage(source);
      expect(result).toMatch('assets/images/banner/PS_MARKETING_VOUCHER_ZLOTY.png');
    })
    it("returns image fallback if currency not found", () => {
      const source = 'AZERTY'
      const result = getPathToAdsPromotionImage(source);
      expect(result).toMatch('assets/images/banner/PS_MARKETING_VOUCHER_DOLLAR.png');
    })
});
