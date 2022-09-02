import {OfferType} from '@/enums/product-feed/offer';
import {
  validateCarrier,
  validateDeliveryTime,
  validateOffers,
  validateCarrierName,
  CustomCarrier,
} from './shipping-rate-provider';

const carrier: CustomCarrier = {
  carrierName: '',
  offerChosen: OfferType.FREE_SHIPPING,
  maxDeliveryTime: 0,
  minDeliveryTime: 0,
  freeShippingOverAmount: {
    shippingRateAmount: 0,
    freeShippingAmount: 0,
  },
  flatShippingRate: {
    shippingRateAmount: 0,
  },
};

describe('Product Feed / Step 2 Option 1 / Estimate Shipping', () => {
  it('should verify if name is valid', () => {
    const mock = {
      ...carrier,
      carrierName: 'DHL',
    };
    expect(validateCarrierName(mock)).toBe(true);
  });
  it('should return false if name is too long', () => {
    const mock = {
      ...carrier,
      carrierName: 'qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqdadassaas',
    };
    expect(validateCarrierName(mock)).toBe(false);
  });

  it('should fails when max delivery > min delivery time is missing', () => {
    const mock = {
      carrierName: '',
      offerChosen: OfferType.FREE_SHIPPING,
      minDeliveryTime: 10,
      maxDeliveryTime: 5,
      freeShippingOverAmount: {
        shippingRateAmount: 0,
        freeShippingAmount: 0,
      },
      flatShippingRate: {
        shippingRateAmount: 0,
      },
    };

    expect(validateDeliveryTime(mock)).toBe(false);
  });

  it('should fails when delivery time is negative', () => {
    const mock = {
      carrierName: '',
      offerChosen: OfferType.FREE_SHIPPING,
      minDeliveryTime: -42,
      maxDeliveryTime: 5,
      freeShippingOverAmount: {
        shippingRateAmount: 0,
        freeShippingAmount: 0,
      },
      flatShippingRate: {
        shippingRateAmount: 0,
      },
    };

    expect(validateDeliveryTime(mock)).toBe(false);
  });

  it('should fails when selected FLAT_SHIPPING_RATE and amount is wrong', () => {
    const mock = {
      carrierName: '',
      offerChosen: OfferType.FLAT_SHIPPING_RATE,
      minDeliveryTime: 0,
      maxDeliveryTime: 0,
      freeShippingOverAmount: {
        shippingRateAmount: 0,
        freeShippingAmount: 0,
      },
      flatShippingRate: {
        shippingRateAmount: -42,
      },
    };

    expect(validateOffers(mock)).toBe(false);
  });

  it('should fails when selected FREE_SHIPPING_OVER_AMOUNT and amount is wrong', () => {
    const mock = {
      carrierName: '',
      offerChosen: OfferType.FREE_SHIPPING_OVER_AMOUNT,
      minDeliveryTime: 0,
      maxDeliveryTime: 0,
      freeShippingOverAmount: {
        shippingRateAmount: -50,
        freeShippingAmount: -77,
      },
      flatShippingRate: {
        shippingRateAmount: 0,
      },
    };

    expect(validateOffers(mock)).toBe(false);
  });

  it('should fails if carrier is not filled corretly', () => {
    const mock = {
      carrierName: 'DLH',
      offerChosen: OfferType.FREE_SHIPPING_OVER_AMOUNT,
      minDeliveryTime: 5,
      maxDeliveryTime: 7,
      freeShippingOverAmount: {
        shippingRateAmount: 0,
        freeShippingAmount: -7,
      },
      flatShippingRate: {
        shippingRateAmount: 0,
      },
    };

    expect(validateCarrier(mock)).toBe(false);
  });
});
