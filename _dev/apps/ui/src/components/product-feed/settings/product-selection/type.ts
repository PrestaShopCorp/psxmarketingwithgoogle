export interface Features {
  value: string;
  id: string;
}

export type ProductFilter = {
  id?: string,
  attribute?: number | string,
  condition?: string,
  value?: number | string | boolean,
  values?: string[]
}

export type Attribute = {
  id: string,
  value: string
}
