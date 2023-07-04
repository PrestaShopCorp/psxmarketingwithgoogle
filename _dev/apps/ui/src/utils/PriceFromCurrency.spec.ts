/* eslint-disable */

import  {searchPrice} from "./PriceFromCurrency";

 describe("Retrieve price in text from currency shop - PriceFromCurrency", () => {

    it("returns text in euro if french", () => {
      const source = 'EUR'
      const result = searchPrice(source);
      expect(result).toEqual('400€');
    })
    it("returns text in pounds if english", () => {
      const source = 'GBP'
      const result = searchPrice(source);
      expect(result).toEqual('£400');
    })
    it("returns text in dollars if usd", () => {
      const source = 'USD'
      const result = searchPrice(source);
      expect(result).toEqual('$500');
    })
    it("returns text in zloty if polish", () => {
      const source = 'PLN'
      const result = searchPrice(source);
      expect(result).toEqual('1200zł');
    })
    it("returns text fallback if currency not found", () => {
      const source = 'AZERTY'
      const result = searchPrice(source);
      expect(result).toEqual('$500');
    })
});
