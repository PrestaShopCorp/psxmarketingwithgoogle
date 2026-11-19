import {HttpClientError} from 'mktg-with-google-common';

export default class DuplicateShippingServiceNameError extends HttpClientError {
  constructor(message: string, code: number, public duplicates: string[]) {
    super(message, code);
  }
}
