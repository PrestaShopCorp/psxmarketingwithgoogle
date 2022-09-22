import * as Sentry from '@sentry/vue';

export function getDataFromLocalStorage(key: string) {
  try {
    const data = localStorage.getItem(key);

    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error: any) {
    localStorage.removeItem(key);
    Sentry.captureException(new Error(error));
    return null;
  }
}

export function deleteProductFeedDataFromLocalStorage() {
  localStorage.removeItem('productFeed-deliveryDetails');
  localStorage.removeItem('productFeed-attributeMapping');
  localStorage.removeItem('productFeed-targetCountries');
  localStorage.removeItem('productFeed-autoImportShippingSettings');
  localStorage.removeItem('productFeed-shippingSetup');
  localStorage.removeItem('productFeed-estimateCarriers');
  localStorage.removeItem('productFeed-requestSynchronizationNow');
  localStorage.removeItem('selectedProductCategories');
}

export default {getDataFromLocalStorage};
