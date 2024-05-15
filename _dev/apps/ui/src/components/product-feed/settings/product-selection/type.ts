export interface FeatureOption {
  id: number;
  key: string;
  value: string;
  language: string;
}

export interface Feature {
  id: number;
  key: string;
  values: FeatureOption[];
}

export interface BrandOption {
  id: number;
  value: string;
}

export interface CategoryOption {
  id: number;
  value: string;
}

export type ProductFilterValue = number | string | boolean | null;
// eslint-disable-next-line max-len
export type ProductFilterValues = string[] | number[] | BrandOption[] | FeatureOption[] | CategoryOption[];

export type ProductFilterErrors = {
  attribute?: string,
  condition?: string,
  value?: string,
}

export type ProductFilter = {
  id: string,
  attribute?: string,
  condition?: string,
  conditionType?: string,
  value?: ProductFilterValue,
  values?: ProductFilterValues,
  errors?: ProductFilterErrors
}

export type CleanProductFilter = {
  attribute: string,
  condition: string,
  value?: ProductFilterValue,
  values?: ProductFilterValues,
}

export type Attribute = {
  id: string | number,
  value: string
}
