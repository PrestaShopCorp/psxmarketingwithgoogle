export interface Features {
  value: string;
  id: string;
}

export type ProductFilter = {
  attribute: number,
  condition: string,
  value?: number | string | boolean,
  values?: string[]
}
