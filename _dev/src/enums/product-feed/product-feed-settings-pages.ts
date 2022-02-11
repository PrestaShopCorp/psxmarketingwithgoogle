enum ProductFeedSettingsPages {
  TARGET_COUNTRY = 'target-country',
  SHIPPING_SETTINGS = 'shipping-settings',
  ATTRIBUTE_MAPPING = 'attribute-mapping',
  SYNC_SCHEDULE = 'sync-schedule',
  SUMMARY = 'summary',
}

export const ProductFeedSettingsSteps = [
  null,
  ProductFeedSettingsPages.TARGET_COUNTRY,
  ProductFeedSettingsPages.SHIPPING_SETTINGS,
  ProductFeedSettingsPages.ATTRIBUTE_MAPPING,
  ProductFeedSettingsPages.SYNC_SCHEDULE,
  ProductFeedSettingsPages.SUMMARY,
];

export default ProductFeedSettingsPages;
