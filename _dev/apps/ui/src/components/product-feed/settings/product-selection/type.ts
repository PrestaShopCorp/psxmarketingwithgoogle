export interface Features {
  value: string;
  id: string;
}

export type ProductFilterValue = number|string|boolean|null;

export type ProductFilterErrors = {
  attribute?: string,
  condition?: string,
  value?: string,
}

export type ProductFilterValues = {
  id: string,
  value: string
}

export type ProductFilter = {
  id: string,
  attribute?: string,
  condition?: string,
  conditionType?: string,
  value?: ProductFilterValue,
  values?: string[],
  errors?: ProductFilterErrors
}

export type ProductFilterToSend = {
  attribute: string,
  condition?: string,
  value?: ProductFilterValue,
  values?: string[],
}

export type Attribute = {
  id: string,
  value: string
}
