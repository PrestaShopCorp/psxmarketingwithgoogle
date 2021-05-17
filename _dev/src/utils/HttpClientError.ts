export default class HttpClientError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.code = code;
  }
}
