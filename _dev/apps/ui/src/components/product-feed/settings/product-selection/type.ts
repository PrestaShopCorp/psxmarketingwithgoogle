import ProductFilterAttributes from '@/enums/product-feed/product-filter-attributes';
import ProductFilterValueType from '@/enums/product-feed/product-filter-value-type';
import {ProductFilterConditions, ProductFilterConditionsTranslations} from '@/enums/product-feed/product-filter-condition';

export interface FilterConditionConfig {
  multiple: boolean;
  type: ProductFilterValueType;
  translation: ProductFilterConditionsTranslations;
  keys?: string[];
  positive?: boolean;
  integer?: boolean;
}

export type AttributeConditionMap = {
  [condition in ProductFilterConditions]?: FilterConditionConfig;
}

export type AttributeMapCondition = {
  [attribute in ProductFilterAttributes]?: AttributeConditionMap;
}

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

export type ProductFilterValues = string[]
  | number[]
  | BrandOption[]
  | FeatureOption[]
  | CategoryOption[];

export type ProductFilterErrors = {
  attribute?: string,
  condition?: string,
  value?: string,
  values?: number[],
}

export type ProductFilterValidatorOptions = {
  [ProductFilterAttributes.BRAND]: BrandOption[],
  [ProductFilterAttributes.CATEGORY]: CategoryOption[],
  [ProductFilterAttributes.FEATURE]: Feature[],
}

export type ProductFilter = {
  id: string,
  attribute?: string,
  condition?: string,
  conditionType?: string,
  value?: ProductFilterValue | ProductFilterValues,
  errors?: ProductFilterErrors,
  init?: boolean
}

export type CleanProductFilter = {
  attribute: string,
  condition: string,
  value?: ProductFilterValue | ProductFilterValues,
}

export type Attribute = {
  id: string | number,
  value: string
}
