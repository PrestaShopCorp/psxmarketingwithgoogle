import {HttpClientError} from './HttpClientError';

type Options = {
  apiUrl: string,
};
// ToDo: Check if the updated TS linter works after migrating to Vue3
// eslint-disable-next-line no-unused-vars
type ResponseHandler = (response: Response) => Promise<any>;

type QueryParams = {
  correlationId?: string,
  body?: { [key: string]: unknown},
  onResponse?: ResponseHandler,
}

// Allowed methods with the API
export type HttpMethod = 'GET'|'POST'|'DELETE';
const options: Options = {
  apiUrl: '',
};
export const initOnboardingClient = (params: Options) => {
  options.apiUrl = params.apiUrl;
};

const onResponseDefault: ResponseHandler = async (response) => {
  if (!response.ok) {
    throw new HttpClientError(response.statusText, response.status);
  }
  return response;
};

export const fetchOnboarding = async (
  method: HttpMethod,
  path: string,
  queryParams?: QueryParams,
) => {
  if (!options.apiUrl.length) {
    throw new Error('Cannot call onboarding API, client is not initialized (missing URL)');
  }
  const response = await fetch(options.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({method, path, body: queryParams?.body || null}),
  });

  return queryParams?.onResponse ? queryParams?.onResponse(response) : onResponseDefault(response);
};

export default {
  initOnboardingClient,
  fetchOnboarding,
};
