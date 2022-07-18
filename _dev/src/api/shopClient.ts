import HttpClientError from '@/api/HttpClientError';

type Options = {
  shopUrl: string,
  onShopSessionLoggedOut?: Function,
};

const options: Options = {
  shopUrl: '',
};

export const initShopClient = (params: Options) => {
  options.shopUrl = params.shopUrl;
  options.onShopSessionLoggedOut = params.onShopSessionLoggedOut;
};

export const fetchShop = async (action: string, params?: { [key: string]: unknown }) => {
  if (!options.shopUrl.length) {
    throw new Error(`Cannot call action ${action}, API is not initialized (missing shop URL)`);
  }

  const response = await fetch(options.shopUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify({
      action,
      ...params,
    }),
  });

  if (!response.ok) {
    throw new HttpClientError(response.statusText, response.status);
  }

  return response.json();
};

export default {
  initShopClient,
  fetchShop,
};
