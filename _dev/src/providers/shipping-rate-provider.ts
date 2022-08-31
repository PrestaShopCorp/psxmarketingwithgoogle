import {OfferType} from '@/enums/product-feed/offer';

export type CustomCarrier = {
  carrierName: string;
  offerChosen: OfferType,
  maxDeliveryTime: number,
  minDeliveryTime: number,
}

export function validateCarrierName(carrier: CustomCarrier): boolean {
  if (carrier.carrierName.length > 90) {
    return false;
  }
  if (carrier.carrierName === '') {
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
