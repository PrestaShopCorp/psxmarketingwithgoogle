import HttpClientError from './HttpClientError';

type Options = {
  apiUrl: string,
  token: string,
};

const options: Options = {
  apiUrl: '',
  token: '',
};

// Allowed methods with the API
export type HttpMethod = 'GET'|'POST'|'DELETE';

export const initOnboardingClient = (params: Options) => {
  options.apiUrl = params.apiUrl;
  options.token = params.token;
};

export const fetchOnboarding = async (
  method: HttpMethod,
  path: string,
  correlationId: string,
  params?: { [key: string]: unknown,
}) => {
  if (!options.apiUrl.length) {
    throw new Error('Cannot call onboarding API, client is not initialized (missing URL)');
  }
  if (!options.token.length) {
    throw new Error('Cannot call onboarding API, client is not initialized (missing token)');
  }

  const response = await fetch(`${options.apiUrl}/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${options.token}`,
      'x-correlation-id': correlationId,
    },
    body: params && JSON.stringify(params),
  });

  if (!response.ok) {
    throw new HttpClientError(response.statusText, response.status);
  }

  return response.json();
};

export default {
  initOnboardingClient,
  fetchOnboarding,
};
