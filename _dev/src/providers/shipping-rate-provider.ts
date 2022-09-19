import {OfferType} from '@/enums/product-feed/offer';

export type freeShippingOverAmount = {
  shippingCost: number;
  orderPrice: number;
}

export type flatShippingRate = {
  shippingCost: number;
}

export type CustomCarrier = {
  carrierName: string;
  offer: OfferType|null;
  countries: string[];
  currency: string;
  maxDeliveryTime: number;
  minDeliveryTime: number;
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
    return Number.isInteger(carrier.flatShippingRate.shippingCost)
      && Number(carrier.flatShippingRate.shippingCost) >= 0;
  }

  if (carrier.offer === OfferType.FREE_SHIPPING_OVER_AMOUNT) {
    return Number.isInteger(carrier.freeShippingOverAmount.orderPrice)
      && Number.isInteger(carrier.freeShippingOverAmount.shippingCost)
      && Number(carrier.freeShippingOverAmount.orderPrice) >= 0
      && Number(carrier.freeShippingOverAmount.shippingCost) >= 0;
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
