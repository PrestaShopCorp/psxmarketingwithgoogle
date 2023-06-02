import {getCurrencyFromCountry} from './Countries';

describe('Countries utility functions', () => {
  describe('getCurrencyFromCountry()', () => {
    it('finds the currency of France', () => {
      expect(getCurrencyFromCountry('FR')).toBe('EUR');
    });
    it('finds the currency of Poland', () => {
      expect(getCurrencyFromCountry('PL')).toBe('PLN');
    });
    it('finds the currency of Sweden', () => {
      expect(getCurrencyFromCountry('SE')).toBe('SEK');
    });
    it('finds the currency of The United Kingdom', () => {
      expect(getCurrencyFromCountry('GB')).toBe('GBP');
    });
    it('finds the currency of The United States', () => {
      expect(getCurrencyFromCountry('US')).toBe('USD');
    });
    it('returns nothing when the country does not exist', () => {
      expect(getCurrencyFromCountry('❓')).toBeUndefined();
    });
  });
});
