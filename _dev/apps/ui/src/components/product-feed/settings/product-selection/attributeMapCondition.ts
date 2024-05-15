import ProductFilterAttributes from '@/enums/product-feed/product-filter-attributes';
import ProductFilterValueType from '@/enums/product-feed/product-filter-value-type';
import {ProductFilterConditions, ProductFilterConditionsTranslations} from '@/enums/product-feed/product-filter-condition';

const ATTRIBUTE_MAP_CONDITION = {
  [ProductFilterAttributes.BRAND]: {
    [ProductFilterConditions.DOES_CONTAIN]: {
      multiple: true,
      type: ProductFilterValueType.STRING,
      translation: ProductFilterConditionsTranslations.CONTAINS,
    },
    [ProductFilterConditions.DOES_NOT_CONTAIN]: {
      multiple: true,
      type: ProductFilterValueType.STRING,
      translation: ProductFilterConditionsTranslations.NOT_CONTAIN,
    },
    [ProductFilterConditions.IS]: {
      multiple: true,
      type: ProductFilterValueType.OBJECT,
      keys: ['value', 'id'],
      translation: ProductFilterConditionsTranslations.IS_IN,
    },
    [ProductFilterConditions.IS_NOT]: {
      multiple: true,
      type: ProductFilterValueType.OBJECT,
      keys: ['value', 'id'],
      translation: ProductFilterConditionsTranslations.IS_NOT,
    },
  },
  [ProductFilterAttributes.CATEGORY]: {
    [ProductFilterConditions.DOES_CONTAIN]: {
      multiple: true,
      type: ProductFilterValueType.STRING,
      translation: ProductFilterConditionsTranslations.CONTAINS,
    },
    [ProductFilterConditions.DOES_NOT_CONTAIN]: {
      multiple: true,
      type: ProductFilterValueType.STRING,
      translation: ProductFilterConditionsTranslations.NOT_CONTAIN,
    },
    [ProductFilterConditions.IS]: {
      multiple: true,
      type: ProductFilterValueType.OBJECT,
      keys: ['value', 'id'],
      translation: ProductFilterConditionsTranslations.IS_IN,
    },
    [ProductFilterConditions.IS_NOT]: {
      multiple: true,
      type: ProductFilterValueType.OBJECT,
      keys: ['value', 'id'],
      translation: ProductFilterConditionsTranslations.IS_NOT,
    },
  },
  [ProductFilterAttributes.PRICE]: {
    [ProductFilterConditions.IS]: {
      multiple: false,
      type: ProductFilterValueType.INT,
      positive: false,
      translation: ProductFilterConditionsTranslations.IS_EQUAL_TO,
    },
    [ProductFilterConditions.GREATER]: {
      multiple: false,
      type: ProductFilterValueType.INT,
      positive: false,
      translation: ProductFilterConditionsTranslations.IS_GREATER_THAN,
    },
    [ProductFilterConditions.LOWER]: {
      multiple: false,
      type: ProductFilterValueType.INT,
      positive: false,
      translation: ProductFilterConditionsTranslations.IS_LESS_THAN,
    },
  },
  [ProductFilterAttributes.PRODUCT_ID]: {
    [ProductFilterConditions.IS]: {
      multiple: true,
      type: ProductFilterValueType.INT,
      positive: true,
      translation: ProductFilterConditionsTranslations.IS_EQUAL_TO,
    },
    [ProductFilterConditions.IS_NOT]: {
      multiple: true,
      type: ProductFilterValueType.INT,
      positive: true,
      translation: ProductFilterConditionsTranslations.IS_NOT_EQUAL_TO,
    },
  },
  [ProductFilterAttributes.OUT_OF_STOCK]: {
    [ProductFilterConditions.IS]: {
      multiple: false,
      type: ProductFilterValueType.BOOLEAN,
      translation: ProductFilterConditionsTranslations.IS_EQUAL_TO,
    },
  },
  [ProductFilterAttributes.FEATURE]: {
    [ProductFilterConditions.IS]: {
      multiple: true,
      type: ProductFilterValueType.OBJECT,
      keys: ['id', 'key', 'value', 'language'],
      translation: ProductFilterConditionsTranslations.IS_IN,
    },
    [ProductFilterConditions.IS_NOT]: {
      multiple: true,
      type: ProductFilterValueType.OBJECT,
      keys: ['id', 'key', 'value', 'language'],
      translation: ProductFilterConditionsTranslations.IS_NOT,
    },
  },
};

export default ATTRIBUTE_MAP_CONDITION;
