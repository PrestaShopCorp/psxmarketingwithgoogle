import {HttpClientError} from './HttpClientError';

type Options = {
  apiUrl: string,
  token: string,
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
export const noCorrelationIdValue: string = 'no-correlation-id-provided';

const options: Options = {
  apiUrl: '',
  token: '',
};
export const initOnboardingClient = (params: Options) => {
  options.apiUrl = params.apiUrl;
  options.token = params.token;
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
  if (!options.token.length) {
    throw new Error('Cannot call onboarding API, client is not initialized (missing token)');
  }

  const response = await fetch(`${options.apiUrl}/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${options.token}`,
      'x-correlation-id': queryParams?.correlationId || noCorrelationIdValue,
    },
    body: queryParams?.body && JSON.stringify(queryParams?.body),
  });

  return queryParams?.onResponse ? queryParams?.onResponse(response) : onResponseDefault(response);
};

export default {
  initOnboardingClient,
  fetchOnboarding,
};
