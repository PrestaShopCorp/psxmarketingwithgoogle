import {shippingPhpExport} from '@/../.storybook/mock/shipping-settings';
import DeliveryType from '@/enums/product-feed/delivery-type';
import {
  getEnabledCarriers, Carrier, validateDeliveryDetail,
} from './shipping-settings-provider';
import {shippingBugExport} from '@/../.storybook/mock/shipping-settings-bug';

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
        carrierId: '2',
        country: 'FR',
        name: 'basic carrier',
        delay: 'delivery in one day!',
      },
      {
        carrierId: '2',
        country: 'IT',
        name: 'basic carrier',
        delay: 'delivery in one day!',
      },
      {
        carrierId: '2',
        country: 'US',
        name: 'basic carrier',
        delay: 'delivery in one day!',
      },
      {
        carrierId: '7',
        country: 'FR',
        name: 'test carrier',
        delay: 'delivery in 5 days',
      },
      {
        carrierId: '7',
        country: 'IT',
        name: 'test carrier',
        delay: 'delivery in 5 days',
      },
      {
        carrierId: '7',
        country: 'US',
        name: 'test carrier',
        delay: 'delivery in 5 days',
      },
    ]);
  });

  it('merges duplicated country iso codes', () => {
    const result: Carrier[] = getEnabledCarriers(shippingBugExport);

    expect(result).toEqual([{
      carrierId: '123',
      country: 'IT',
      delay: '-',
      name: 'GLS',
    }]);
  });
});

describe('Shipping Settings Provider - validateDeliveryDetail()', () => {
  it('does not check disabled carriers', () => {
    const result = validateDeliveryDetail({
      country: 'FR',
      carrierId: '11',
      enabledCarrier: false,
    });

    expect(result).toBe(true);
  });

  it('returns true when delivery details are valid', () => {
    const result = validateDeliveryDetail({
      country: 'FR',
      carrierId: '11',
      minHandlingTimeInDays: 1,
      maxHandlingTimeInDays: 2,
      minTransitTimeInDays: 3,
      maxTransitTimeInDays: 4,
      deliveryType: DeliveryType.DELIVERY,
      name: 'Carrier',
      enabledCarrier: true,
    });

    expect(result).toBe(true);
  });

  it('fails when min transit time is missing', () => {
    const result = validateDeliveryDetail({
      country: 'FR',
      carrierId: '11',
      minHandlingTimeInDays: 1,
      maxHandlingTimeInDays: 2,
      maxTransitTimeInDays: 4,
      deliveryType: DeliveryType.DELIVERY,
      name: 'Carrier',
      enabledCarrier: true,
    });

    expect(result).toBe(false);
  });

  it('fails when max transit time is missing', () => {
    const result = validateDeliveryDetail({
      country: 'FR',
      carrierId: '11',
      minHandlingTimeInDays: 1,
      maxHandlingTimeInDays: 2,
      minTransitTimeInDays: 3,
      deliveryType: DeliveryType.DELIVERY,
      name: 'Carrier',
      enabledCarrier: true,
    });

    expect(result).toBe(false);
  });

  it('fails when delivery type is missing', () => {
    const result = validateDeliveryDetail({
      country: 'FR',
      carrierId: '11',
      minHandlingTimeInDays: 1,
      maxHandlingTimeInDays: 2,
      minTransitTimeInDays: 3,
      maxTransitTimeInDays: 4,
      name: 'Carrier',
      enabledCarrier: true,
    });

    expect(result).toBe(false);
  });

  it('fails when min transit time is negative', () => {
    const result = validateDeliveryDetail({
      country: 'FR',
      carrierId: '11',
      minHandlingTimeInDays: 1,
      maxHandlingTimeInDays: 2,
      minTransitTimeInDays: -3,
      maxTransitTimeInDays: 4,
      deliveryType: DeliveryType.DELIVERY,
      name: 'Carrier',
      enabledCarrier: true,
    });

    expect(result).toBe(false);
  });

  it('fails when max transit time is negative', () => {
    const result = validateDeliveryDetail({
      country: 'FR',
      carrierId: '11',
      minHandlingTimeInDays: 1,
      maxHandlingTimeInDays: 2,
      minTransitTimeInDays: 3,
      maxTransitTimeInDays: -4,
      deliveryType: DeliveryType.DELIVERY,
      name: 'Carrier',
      enabledCarrier: true,
    });

    expect(result).toBe(false);
  });

  it('pass when the min and max are the same', () => {
    const result = validateDeliveryDetail({
      country: 'FR',
      carrierId: '11',
      minHandlingTimeInDays: 0,
      maxHandlingTimeInDays: 0,
      minTransitTimeInDays: 3,
      maxTransitTimeInDays: 3,
      deliveryType: DeliveryType.DELIVERY,
      name: 'Carrier',
      enabledCarrier: true,
    });

    expect(result).toBe(true);
  });

  it('fails when min transit time is above max', () => {
    const result = validateDeliveryDetail({
      country: 'FR',
      carrierId: '11',
      minHandlingTimeInDays: 0,
      maxHandlingTimeInDays: 0,
      minTransitTimeInDays: 3,
      maxTransitTimeInDays: 0,
      deliveryType: DeliveryType.DELIVERY,
      name: 'Carrier',
      enabledCarrier: true,
    });

    expect(result).toBe(false);
  });

  it('fails when numbers are not integers', () => {
    const result = validateDeliveryDetail({
      country: 'FR',
      carrierId: '11',
      minHandlingTimeInDays: 0.2,
      maxHandlingTimeInDays: 0.3,
      minTransitTimeInDays: 3.9,
      maxTransitTimeInDays: 6.444441,
      deliveryType: DeliveryType.DELIVERY,
      name: 'Carrier',
      enabledCarrier: true,
    });

    expect(result).toBe(false);
  });
});
