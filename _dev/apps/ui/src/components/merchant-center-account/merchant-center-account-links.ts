export const getMerchantCenterWebsiteUrls = (id: string) => ({
  website: `https://merchants.google.com/mc/settings/website?a=${id}`,
  businessInfo: `https://merchants.google.com/mc/merchantprofile/businessinfo?a=${id}`,
  overview: `https://merchants.google.com/mc/overview?a=${id}`,
  diagnostics: `https://merchants.google.com/mc/products/diagnostics?a=${id}`,
});

export default {
  getMerchantCenterWebsiteUrls,
};
