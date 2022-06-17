export enum ShopShippingCollectionType {
    CARRIERS = 'carriers',
    CARRIER_DETAILS = 'carrier_details',
    CARRIER_TAXES = 'carrier_taxes',
}

export type ShopShippingInterface = {
    collection: ShopShippingCollectionType,
    id: string,
    properties: {
        // eslint-disable-next-line camelcase
        id_carrier: string,
        // eslint-disable-next-line camelcase
        id_reference: string,
        name: string,
        active: boolean,
        deleted: boolean,
        delay: string,
        // eslint-disable-next-line camelcase
        country_ids: string, // i.e "FR,IT,US"
    }
}

export type CarrierIdentifier = {
  carrierId: string,
  country: string
}

export type Carrier = {
    carrierId: string,
    country: string
    name: string,
    delay: string,
}

export enum ShipmentType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup',
}

/* Object expected on the API */
export type DeliveryDetail = {
  country: string;
  carrierId: string;
  minHandlingTimeInDays?: number;
  maxHandlingTimeInDays?: number;
  minTransitTimeInDays?: number;
  maxTransitTimeInDays?: number;
  deliveryType?: ShipmentType;

  // Data that can be set by the interface but unused on the API side
  name?: string;
  delay?: string;
  enabledCarrier?: boolean;
}

export function getEnabledCarriers(source: ShopShippingInterface[]): Carrier[] {
  return source.filter((carrier) => carrier.collection === ShopShippingCollectionType.CARRIERS
        && carrier.properties.active === true
        && carrier.properties.deleted === false,
  ).flatMap((carrier) => carrier.properties.country_ids.split(',').map((country) => ({
    carrierId: carrier.properties.id_reference,
    country,
    name: carrier.properties.name,
    delay: carrier.properties.delay,
  })),
  );
}

export function validateDeliveryDetail(delivery: DeliveryDetail): boolean {
  if (!delivery.enabledCarrier) {
    return false;
  }

  return delivery.enabledCarrier
      && validateHandlingTimes(delivery)
      && validateTransitTimes(delivery)
      && !!delivery.deliveryType;
}

export function validateHandlingTimes(delivery: DeliveryDetail): boolean {
  if (!delivery.enabledCarrier) {
    return true;
  }

  if (delivery.deliveryType !== ShipmentType.DELIVERY) {
    return true;
  }

  return Number.isInteger(delivery.minHandlingTimeInDays)
    && Number.isInteger(delivery.maxHandlingTimeInDays)
    && Number(delivery.minHandlingTimeInDays) <= Number(delivery.maxHandlingTimeInDays)
    && Number(delivery.minHandlingTimeInDays) >= 0
    && Number(delivery.maxHandlingTimeInDays) >= 0;
}

export function validateTransitTimes(delivery: DeliveryDetail): boolean {
  if (!delivery.enabledCarrier) {
    return true;
  }

  if (delivery.deliveryType !== ShipmentType.DELIVERY) {
    return true;
  }

  return Number.isInteger(delivery.minTransitTimeInDays)
    && Number.isInteger(delivery.maxTransitTimeInDays)
    && Number(delivery.minTransitTimeInDays) <= Number(delivery.maxTransitTimeInDays)
    && Number(delivery.minTransitTimeInDays) >= 0
    && Number(delivery.maxTransitTimeInDays) >= 0;
}
