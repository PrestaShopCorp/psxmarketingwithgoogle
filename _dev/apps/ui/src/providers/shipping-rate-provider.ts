import {OfferType} from '@/enums/product-feed/offer';
import {RateType} from '@/enums/product-feed/rate';
import store from '@/store';

export type freeShippingOverAmount = {
  shippingCost: number|null;
  orderPrice: number|null;
}

export type flatShippingRate = {
  shippingCost: number|null;
}

export type CustomCarrier = {
  carrierName: string;
  offer: OfferType|null;
  countries: string[];
  currency: string;
  maxDeliveryTime: number|null;
  minDeliveryTime: number|null;
  validationError?: boolean;
  freeShippingOverAmount: freeShippingOverAmount;
  flatShippingRate: flatShippingRate;
}

export function validateCarrier(carrier: CustomCarrier): boolean {
  if (!validateCarrierName(carrier)
    || !validateDeliveryTime(carrier)
    || !validateOfferChoice(carrier.offer)
  ) {
    return false;
  }

  if (carrier.offer !== OfferType.FREE_SHIPPING) {
    return validateOffers(carrier);
  }

  return true;
}

export function validateCarrierName(carrier: CustomCarrier): boolean {
  if (carrier.carrierName === '') {
    return false;
  }

  if (carrier.carrierName.length > 90 || carrier.carrierName.length <= 0) {
    return false;
  }

  return true;
}

export function validateDeliveryTime(carrier: CustomCarrier): boolean {
  return Number.isInteger(carrier.minDeliveryTime)
    && Number.isInteger(carrier.maxDeliveryTime)
    && Number(carrier.minDeliveryTime) <= Number(carrier.maxDeliveryTime)
    && Number(carrier.minDeliveryTime) >= 0
    && Number(carrier.maxDeliveryTime) >= 0;
}

export function validateOffers(carrier: CustomCarrier): boolean {
  if (carrier.offer === OfferType.FLAT_SHIPPING_RATE) {
    return !Number.isNaN(carrier.flatShippingRate.shippingCost)
      && Number(carrier.flatShippingRate.shippingCost) > 0;
  }

  if (carrier.offer === OfferType.FREE_SHIPPING_OVER_AMOUNT) {
    return !Number.isNaN(carrier.freeShippingOverAmount.orderPrice)
      && !Number.isNaN(carrier.freeShippingOverAmount.shippingCost)
      && Number(carrier.freeShippingOverAmount.orderPrice) > 0
      && Number(carrier.freeShippingOverAmount.shippingCost) > 0;
  }

  return true;
}

export function validateOfferChoice(offer: OfferType|null): boolean {
  if (!offer) {
    return false;
  }

  const values = Object.values(OfferType);

  if (values.includes(offer as OfferType)) {
    return true;
  }

  return false;
}

export function createCustomCarriersTemplate(
  rate: RateType,
  countries: string[],
  currency: string,
): CustomCarrier[] {
  const template: CustomCarrier[] = [];

  if (rate === RateType.RATE_PER_COUNTRY) {
    countries.forEach((country) => {
      template.push(generateEmptyCarrier(
        currency,
        [country],
      ));
    });
    return template;
  }

  if (rate === RateType.RATE_ALL_COUNTRIES) {
    template.push(generateEmptyCarrier(
      currency,
      countries,
    ));
  }
  return template;
}

export function generateEmptyCarrier(
  currency: string,
  countries: string[],
): CustomCarrier {
  return {
    carrierName: '',
    offer: null,
    countries,
    currency,
    maxDeliveryTime: null,
    minDeliveryTime: null,
    [OfferType.FREE_SHIPPING_OVER_AMOUNT]: {
      shippingCost: null,
      orderPrice: null,
    },
    [OfferType.FLAT_SHIPPING_RATE]: {
      shippingCost: null,
    },
  };
}

export function toApi(customerCarrier: CustomCarrier[], currencyShop): CustomCarrier[] {
  if (customerCarrier === null || customerCarrier.length === 0) {
    return [];
  }
  const toApiFormat = [...customerCarrier];

  toApiFormat.forEach((carrier) => {
    if (carrier.flatShippingRate.shippingCost === null) {
      carrier.flatShippingRate.shippingCost = 0;
    }
    if (carrier.freeShippingOverAmount.orderPrice === null) {
      carrier.freeShippingOverAmount.orderPrice = 0;
    }
    if (carrier.freeShippingOverAmount.shippingCost === null) {
      carrier.freeShippingOverAmount.shippingCost = 0;
    }
    if (carrier.currency !== currencyShop) {
      carrier.currency = currencyShop;
    }
  });

  return toApiFormat;
}

export function fromApi(customerCarriers: CustomCarrier[]): CustomCarrier[] {
  if (customerCarriers === null || customerCarriers.length === 0) {
    return [];
  }
  const fromApiFormat = [...customerCarriers];

  fromApiFormat.forEach((carrier: CustomCarrier) => {
    if (carrier.flatShippingRate.shippingCost === 0) {
      carrier.flatShippingRate.shippingCost = null;
    }

    if (carrier.freeShippingOverAmount.orderPrice === 0) {
      carrier.freeShippingOverAmount.orderPrice = null;
    }

    if (carrier.freeShippingOverAmount.shippingCost === 0) {
      carrier.freeShippingOverAmount.shippingCost = null;
    }
  });

  return fromApiFormat;
}
