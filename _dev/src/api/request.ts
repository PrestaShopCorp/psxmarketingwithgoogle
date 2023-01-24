import HttpClientError from '@/utils/HttpClientError';

async function call<T>(
  method: string,
  params: { [key:string] : unknown},
  url: string,
  token?: string,
  correlationId?: string,
): Promise<T> {
  const request: Partial<RequestInit> = {
    method,
    headers: buildHeaders(token, correlationId),
  };

  if (method === 'POST') {
    request.body = JSON.stringify(params);
  }

  const response = await fetch(url, request);

  if (response.ok) {
    return response.json();
  }
  throw new HttpClientError(response.statusText, response.status);
}

function buildHeaders(token?: string, correlationId?: string): Headers {
  const headers: Headers = new Headers(
    {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  );

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  if (correlationId) {
    headers.append('x-correlation-id', correlationId);
  }

  return headers;
}

export default call;
