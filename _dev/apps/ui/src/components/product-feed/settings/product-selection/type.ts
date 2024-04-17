export interface Features {
  value: string;
  id: string;
}

export type ProductFilterValue = number|string|boolean|null;

export type ProductFilter = {
  id?: string,
  attribute?: number | string,
  condition?: string,
  value?: ProductFilterValue,
  values?: string[]
}

export type Attribute = {
  id: string,
  value: string
}
