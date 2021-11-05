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
        name: string,
        active: boolean,
        deleted: boolean,
        delay: string,
        // eslint-disable-next-line camelcase
        country_ids: string, // i.e "FR,IT,US"
    }
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
  minHandlingTimeInDays: number;
  maxHandlingTimeInDays: number;
  minTransitTimeInDays: number;
  maxTransitTimeInDays: number;
  deliveryType: ShipmentType;
}

export function getEnabledCarriers(source: ShopShippingInterface[]): Carrier[] {
  return source.filter((carrier) => carrier.collection === ShopShippingCollectionType.CARRIERS
        && carrier.properties.active === true
        && carrier.properties.deleted === false,
  ).flatMap((carrier) => carrier.properties.country_ids.split(',').map((country) => ({
    carrierId: carrier.properties.id_carrier,
    country,
    name: carrier.properties.name,
    delay: carrier.properties.delay,
  })),
  );
}
