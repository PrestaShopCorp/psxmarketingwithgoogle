export default class DuplicateShippingServiceNameError extends Error {
  constructor(message: string, public code: number, public duplicates: string[]) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.code = code;
    this.duplicates = duplicates;
  }
}
