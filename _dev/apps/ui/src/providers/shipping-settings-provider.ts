import DeliveryType from '../enums/product-feed/delivery-type';

export enum ShopShippingCollectionType {
    CARRIERS = 'carriers',
    CARRIER_DETAILS = 'carrier_details',
    CARRIER_TAXES = 'carrier_taxes',
}

type ShopShippingCarrierInterface = {
  collection: ShopShippingCollectionType.CARRIERS,
  id: string|number,
  properties: ShopShippingCarrierPropertiesInterface
};
type ShopShippingCarrierDetailInterface = {
  collection: ShopShippingCollectionType.CARRIER_DETAILS,
  id: string|number,
  properties: ShopShippingCarrierDetailPropertiesInterface
};
type ShopShippingCarrierTaxInterface = {
  collection: ShopShippingCollectionType.CARRIER_TAXES,
  id: string|number,
  properties: ShopShippingCarrierTaxPropertiesInterface
};

export type ShopShippingInterface = ShopShippingCarrierInterface
  | ShopShippingCarrierDetailInterface
  | ShopShippingCarrierTaxInterface;

export type ShopShippingCarrierPropertiesInterface = {
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
  // eslint-disable-next-line camelcase
  carrier_taxes_rates_group_id?: string,
  url?: string,
  // eslint-disable-next-line camelcase
  shipping_handling?: number,
  // eslint-disable-next-line camelcase
  free_shipping_starts_at_price?: number,
  // eslint-disable-next-line camelcase
  free_shipping_starts_at_weight?: number,
  // eslint-disable-next-line camelcase
  disable_carrier_when_out_of_range?: boolean,
  // eslint-disable-next-line camelcase
  is_module?: boolean,
  // eslint-disable-next-line camelcase
  is_free?: boolean,
  // eslint-disable-next-line camelcase
  shipping_external?: boolean,
  // eslint-disable-next-line camelcase
  need_range?: boolean,
  // eslint-disable-next-line camelcase
  external_module_name?: string,
  // eslint-disable-next-line camelcase
  max_width?: number,
  // eslint-disable-next-line camelcase
  max_height?: number,
  // eslint-disable-next-line camelcase
  max_depth?: number,
  // eslint-disable-next-line camelcase
  max_weight?: number,
  grade?: number,
  currency?: string,
  // eslint-disable-next-line camelcase
  weight_unit?: string,
}

export type ShopShippingCarrierDetailPropertiesInterface = {
  // eslint-disable-next-line camelcase
  id_reference: string,
  // eslint-disable-next-line camelcase
  id_carrier_detail: string,
  // eslint-disable-next-line camelcase
  shipping_method: string,
  delimiter1: number,
  delimiter2: number,
  // eslint-disable-next-line camelcase
  country_ids: string,
  // eslint-disable-next-line camelcase
  state_ids: string,
  price: number,
}

export type ShopShippingCarrierTaxPropertiesInterface = {
  // eslint-disable-next-line camelcase
  id_reference: string,
  // eslint-disable-next-line camelcase
  id_carrier_tax: string,
  // eslint-disable-next-line camelcase
  country_id: string,
  // eslint-disable-next-line camelcase
  state_ids: string,
  // eslint-disable-next-line camelcase
  tax_rate: number,
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

/* Object expected on the API */
export type DeliveryDetail = {
  country: string;
  carrierId: string;
  minHandlingTimeInDays?: number;
  maxHandlingTimeInDays?: number;
  minTransitTimeInDays?: number;
  maxTransitTimeInDays?: number;
  deliveryType?: DeliveryType;

  // Data that can be set by the interface but unused on the API side
  name?: string;
  delay?: string;
  enabledCarrier?: boolean;
}

/**
 * Filters on active carriers, then clone them as many time as they have assigned countries
 */
export function getEnabledCarriers(source: ShopShippingInterface[]): Carrier[] {
  return source.filter((carrier) => carrier.collection === ShopShippingCollectionType.CARRIERS
        && (carrier.properties as ShopShippingCarrierPropertiesInterface).active === true
        && (carrier.properties as ShopShippingCarrierPropertiesInterface).deleted === false,
  ).flatMap((carrier) => {
    const properties = carrier.properties as ShopShippingCarrierPropertiesInterface;

    // Countries may be duplicated on shops, and their iso code are not unique.
    return [...new Set(properties.country_ids.split(','))].map((country) => ({
      carrierId: properties.id_reference,
      country,
      name: properties.name,
      delay: properties.delay,
    }));
  });
}

/**
 *
 * @param carriersFromShop DeliveryDetail[]
 * @param carriersFromApi DeliveryDetail[]
 * @param carriersFromLocalStorage DeliveryDetail[]
 * @returns DeliveryDetail[]
 */
export function mergeShippingDetailsSourcesForProductFeedConfiguration(
  carriersFromShop: DeliveryDetail[],
  carriersFromApi: DeliveryDetail[],
  carriersFromLocalStorage: DeliveryDetail[] = [],
): DeliveryDetail[] {
  const deliveryDetailsStructure: Partial<DeliveryDetail> = {
    deliveryType: DeliveryType.DELIVERY,
    minHandlingTimeInDays: 0,
    maxHandlingTimeInDays: 0,
    minTransitTimeInDays: undefined,
    maxTransitTimeInDays: undefined,
  };

  /**
   * Temporary method for backward compatibility with data created before october 2022
   * Fix data from API with data we do not care about anymore
   */
  const deliveryUpdateForNewShippingSettings = (carrier: DeliveryDetail) => ({
    enabledCarrier: (carrier.enabledCarrier && carrier.deliveryType === DeliveryType.DELIVERY),
    deliveryType: DeliveryType.DELIVERY,
    minHandlingTimeInDays: 0,
    maxHandlingTimeInDays: 0,
  });

  // Carriers will be all enabled by default if nothing has been configured yet
  const enableCarriersByDefault = !carriersFromLocalStorage.length
    && !carriersFromApi.length;

  return carriersFromShop.map((carrierFromShop) => {
    const deliveryDetailsSavedInLocalStorage = carriersFromLocalStorage.find(
      (c : DeliveryDetail) => (
        (c.carrierId === carrierFromShop.carrierId) && (c.country === carrierFromShop.country)
      ),
    );

    if (deliveryDetailsSavedInLocalStorage) {
      return {
        ...deliveryDetailsStructure,
        ...deliveryDetailsSavedInLocalStorage,
        ...carrierFromShop,
        ...deliveryUpdateForNewShippingSettings(deliveryDetailsSavedInLocalStorage),
      };
    }

    const deliveryDetailsSavedOnAPI = carriersFromApi.find(
      (deliveryDetail: DeliveryDetail) => deliveryDetail.carrierId === carrierFromShop.carrierId
              && carrierFromShop.country === deliveryDetail.country);

    if (deliveryDetailsSavedOnAPI) {
      return {
        ...deliveryDetailsStructure,
        ...deliveryDetailsSavedOnAPI,
        ...carrierFromShop,
        ...deliveryUpdateForNewShippingSettings(deliveryDetailsSavedOnAPI),
      };
    }

    return {
      ...deliveryDetailsStructure,
      enabledCarrier: enableCarriersByDefault,
      ...carrierFromShop,
    };
  });
}

export function validateDeliveryDetail(delivery: DeliveryDetail): boolean {
  if (!delivery.enabledCarrier) {
    return true;
  }

  return delivery.enabledCarrier
      && validateTransitTimes(delivery)
      && !!delivery.deliveryType;
}

export function validateTransitTimes(delivery: DeliveryDetail): boolean {
  if (!delivery.enabledCarrier) {
    return true;
  }

  if (delivery.deliveryType !== DeliveryType.DELIVERY) {
    return true;
  }

  return Number.isInteger(delivery.minTransitTimeInDays)
    && Number.isInteger(delivery.maxTransitTimeInDays)
    && Number(delivery.minTransitTimeInDays) <= Number(delivery.maxTransitTimeInDays)
    && Number(delivery.minTransitTimeInDays) >= 0
    && Number(delivery.maxTransitTimeInDays) >= 0;
}

export function validateEachCountryHasAtLeastOneCarrier(
  countries: string[],
  enabledDeliveryDetails: DeliveryDetail[],
): boolean {
  return countries.every((country: string) => enabledDeliveryDetails.find(
    (deliveryDetail: DeliveryDetail) => deliveryDetail.country === country
      && deliveryDetail.enabledCarrier,
  ));
}
