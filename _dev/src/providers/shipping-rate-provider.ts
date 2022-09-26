import {OfferType} from '@/enums/product-feed/offer';
import {RateType} from '@/enums/product-feed/rate';

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
  rate: RateType|null;
  countries: string[];
  currency: string;
  maxDeliveryTime: number|null;
  minDeliveryTime: number|null;
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

export function generateCustomCarrier(): CustomCarrier {
  return {
    carrierName: '',
    countries: [],
    currency: '',
    rate: RateType.RATE_ALL_COUNTRIES,
    offer: null,
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
