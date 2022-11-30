import {OfferType} from '@/enums/product-feed/offer';
import {RateType} from '@/enums/product-feed/rate';
import {
  validateCarrier,
  validateDeliveryTime,
  validateOffers,
  validateCarrierName,
  CustomCarrier,
  toApi,
  fromApi,
} from './shipping-rate-provider';

const carrier: CustomCarrier = {
  carrierName: '',
  countries: [],
  currency: '',
  offer: OfferType.FREE_SHIPPING,
  maxDeliveryTime: 0,
  minDeliveryTime: 0,
  freeShippingOverAmount: {
    shippingCost: 0,
    orderPrice: 0,
  },
  flatShippingRate: {
    shippingCost: 0,
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
      offer: OfferType.FREE_SHIPPING,
      countries: [],
      currency: '',
      minDeliveryTime: 10,
      maxDeliveryTime: 5,
      freeShippingOverAmount: {
        shippingCost: 0,
        orderPrice: 0,
      },
      flatShippingRate: {
        shippingCost: 0,
      },
    };

    expect(validateDeliveryTime(mock)).toBe(false);
  });

  it('should fails when delivery time is negative', () => {
    const mock = {
      carrierName: '',
      offer: OfferType.FREE_SHIPPING,
      countries: [],
      currency: '',
      minDeliveryTime: -42,
      maxDeliveryTime: 5,
      freeShippingOverAmount: {
        shippingCost: 0,
        orderPrice: 0,
      },
      flatShippingRate: {
        shippingCost: 0,
      },
    };

    expect(validateDeliveryTime(mock)).toBe(false);
  });

  it('should fails when selected FLAT_SHIPPING_RATE and amount is wrong', () => {
    const mock = {
      carrierName: '',
      offer: OfferType.FLAT_SHIPPING_RATE,
      minDeliveryTime: 0,
      maxDeliveryTime: 0,
      countries: [],
      currency: '',
      freeShippingOverAmount: {
        shippingCost: 0,
        orderPrice: 0,
      },
      flatShippingRate: {
        shippingCost: -42,
      },
    };

    expect(validateOffers(mock)).toBe(false);
  });

  it('should fails when selected FREE_SHIPPING_OVER_AMOUNT and amount is wrong', () => {
    const mock = {
      carrierName: '',
      offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
      minDeliveryTime: 0,
      maxDeliveryTime: 0,
      countries: [],
      currency: '',
      freeShippingOverAmount: {
        shippingCost: -50,
        orderPrice: -77,
      },
      flatShippingRate: {
        shippingCost: 0,
      },
    };

    expect(validateOffers(mock)).toBe(false);
  });

  it('should fails if carrier is not filled corretly', () => {
    const mock = {
      carrierName: 'DLH',
      offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
      minDeliveryTime: 5,
      maxDeliveryTime: 7,
      countries: [],
      currency: '',
      freeShippingOverAmount: {
        shippingCost: 0,
        orderPrice: -7,
      },
      flatShippingRate: {
        shippingCost: 0,
      },
    };

    expect(validateCarrier(mock)).toBe(false);
  });

  it('should transform corretly data for API', () => {
    const validCarrierFromView: CustomCarrier[] = [
      {
        carrierName: 'DLH',
        offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
        minDeliveryTime: 5,
        maxDeliveryTime: 7,
        countries: [],
        currency: '',
        freeShippingOverAmount: {
          shippingCost: null,
          orderPrice: null,
        },
        flatShippingRate: {
          shippingCost: null,
        },
      },
    ];
    const transform = toApi(validCarrierFromView);

    expect(transform).toEqual([
      {
        carrierName: 'DLH',
        offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
        minDeliveryTime: 5,
        maxDeliveryTime: 7,
        countries: [],
        currency: '',
        freeShippingOverAmount: {
          shippingCost: 0,
          orderPrice: 0,
        },
        flatShippingRate: {
          shippingCost: 0,
        },
      },
    ]);
  });

  it('should transform nothing if shippingCost or orderPrice isnt null', () => {
    const validCarrierFromView: CustomCarrier[] = [
      {
        carrierName: 'DLH',
        offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
        minDeliveryTime: 5,
        maxDeliveryTime: 7,
        countries: [],
        currency: '',
        freeShippingOverAmount: {
          shippingCost: 2.99,
          orderPrice: 42.99,
        },
        flatShippingRate: {
          shippingCost: 0,
        },
      },
    ];
    const transform = toApi(validCarrierFromView);

    expect(transform).toEqual([
      {
        carrierName: 'DLH',
        offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
        minDeliveryTime: 5,
        maxDeliveryTime: 7,
        countries: [],
        currency: '',
        freeShippingOverAmount: {
          shippingCost: 2.99,
          orderPrice: 42.99,
        },
        flatShippingRate: {
          shippingCost: 0,
        },
      },
    ]);
  });

  it('should return an empty array if estimateCarriers is empty', () => {
    const transform = toApi([]);

    expect(transform).toEqual([]);
  });

  it('should transform API response to valid format on view', () => {
    const validCarrierFromAPI: CustomCarrier[] = [{
      carrierName: 'DLH',
      offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
      minDeliveryTime: 5,
      maxDeliveryTime: 7,
      countries: [],
      currency: '',
      freeShippingOverAmount: {
        shippingCost: 0,
        orderPrice: 0,
      },
      flatShippingRate: {
        shippingCost: 0,
      },
    }];
    const transform = fromApi(validCarrierFromAPI);

    expect(transform).toEqual([{
      carrierName: 'DLH',
      offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
      minDeliveryTime: 5,
      maxDeliveryTime: 7,
      countries: [],
      currency: '',
      freeShippingOverAmount: {
        shippingCost: null,
        orderPrice: null,
      },
      flatShippingRate: {
        shippingCost: null,
      },
    }]);
  });

  it('should transform API response to valid format on view', () => {
    const validCarrierFromAPI: CustomCarrier[] = [{
      carrierName: 'DLH',
      offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
      minDeliveryTime: 5,
      maxDeliveryTime: 7,
      countries: [],
      currency: '',
      freeShippingOverAmount: {
        shippingCost: 42.99,
        orderPrice: 2.99,
      },
      flatShippingRate: {
        shippingCost: 9,
      },
    }];
    const transform = fromApi(validCarrierFromAPI);

    expect(transform).toEqual([{
      carrierName: 'DLH',
      offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
      minDeliveryTime: 5,
      maxDeliveryTime: 7,
      countries: [],
      currency: '',
      freeShippingOverAmount: {
        shippingCost: 42.99,
        orderPrice: 2.99,
      },
      flatShippingRate: {
        shippingCost: 9,
      },
    }]);
  });

  it('should create a new template when api send empty array for estimateCarriers', () => {
    const transform = fromApi([]);

    expect(transform).toEqual([]);
  });
});
