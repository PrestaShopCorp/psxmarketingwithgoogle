import {OfferType} from '@/enums/product-feed/offer';

export type freeShippingOverAmount = {
  shippingRateAmount: number;
  freeShippingAmount: number;
}

export type flatShippingRate = {
  shippingRateAmount: number;
}

export type CustomCarrier = {
  carrierName: string;
  offerChosen: OfferType;
  maxDeliveryTime: number;
  minDeliveryTime: number;
  freeShippingOverAmount: freeShippingOverAmount;
  flatShippingRate: flatShippingRate;
}

export function validateCarrier(carrier: CustomCarrier): boolean {
  if (!validateCarrierName(carrier)
    || !validateDeliveryTime(carrier)
    || !validateOfferChoice(carrier.offerChosen)
  ) {
    return false;
  }

  if (carrier.offerChosen !== OfferType.FREE_SHIPPING) {
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
  if (carrier.offerChosen === OfferType.FLAT_SHIPPING_RATE) {
    return Number.isInteger(carrier.flatShippingRate.shippingRateAmount)
      && Number(carrier.flatShippingRate.shippingRateAmount) >= 0;
  }

  if (carrier.offerChosen === OfferType.FREE_SHIPPING_OVER_AMOUNT) {
    return Number.isInteger(carrier.freeShippingOverAmount.freeShippingAmount)
      && Number.isInteger(carrier.freeShippingOverAmount.shippingRateAmount)
      && Number(carrier.freeShippingOverAmount.freeShippingAmount) >= 0
      && Number(carrier.freeShippingOverAmount.shippingRateAmount) >= 0;
  }

  return true;
}

export function validateOfferChoice(offerChosen: OfferType): boolean {
  const values = Object.values(OfferType);

  if (values.includes(offerChosen as OfferType)) {
    return true;
  }

  return false;
}
