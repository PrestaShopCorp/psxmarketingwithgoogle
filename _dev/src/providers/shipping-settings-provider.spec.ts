import {shippingPhpExport} from '../../.storybook/mock/shipping-settings';
import {getEnabledCarriers, Carrier} from './shipping-settings-provider';

describe('Shipping Settings Provider - getEnabledCarriers()', () => {
  it('returns the active carriers loaded from PHP', () => {
    const result: Carrier[] = getEnabledCarriers(shippingPhpExport);

    expect(result).toEqual([
      {
        carrierId: '1',
        country: 'FR',
        name: 'free carrier',
        delay: 'Free shipping!',
      },
      {
        carrierId: '1',
        country: 'IT',
        name: 'free carrier',
        delay: 'Free shipping!',
      },
      {
        carrierId: '3',
        country: 'FR',
        name: 'basic carrier',
        delay: 'delivery in one day!',
      },
      {
        carrierId: '3',
        country: 'IT',
        name: 'basic carrier',
        delay: 'delivery in one day!',
      },
      {
        carrierId: '3',
        country: 'US',
        name: 'basic carrier',
        delay: 'delivery in one day!',
      },
      {
        carrierId: '8',
        country: 'FR',
        name: 'test carrier',
        delay: 'delivery in 5 days',
      },
      {
        carrierId: '8',
        country: 'IT',
        name: 'test carrier',
        delay: 'delivery in 5 days',
      },
      {
        carrierId: '8',
        country: 'US',
        name: 'test carrier',
        delay: 'delivery in 5 days',
      },
    ]);
  });
});
