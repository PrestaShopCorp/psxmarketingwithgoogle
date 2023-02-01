import {captureException} from '@sentry/vue';

export function getDataFromLocalStorage(key: string) {
  try {
    const data = localStorage.getItem(key);

    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error: any) {
    localStorage.removeItem(key);
    captureException(new Error(error));
    return null;
  }
}

export function deleteProductFeedDataFromLocalStorage() {
  localStorage.removeItem('productFeed-deliveryDetails');
  localStorage.removeItem('productFeed-attributeMapping');
  localStorage.removeItem('productFeed-targetCountries');
  localStorage.removeItem('productFeed-rateChosen');
  localStorage.removeItem('productFeed-autoImportShippingSettings');
  localStorage.removeItem('productFeed-shippingSetup');
  localStorage.removeItem('productFeed-estimateCarriers');
  localStorage.removeItem('productFeed-requestSynchronizationNow');
  localStorage.removeItem('productFeed-selectedProductCategories');
  // Cleanup old name of product categories
  localStorage.removeItem('selectedProductCategories');
}

export default {getDataFromLocalStorage};
