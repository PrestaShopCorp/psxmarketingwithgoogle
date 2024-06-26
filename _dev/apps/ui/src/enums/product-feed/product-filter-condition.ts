export enum ProductFilterBooleanConditions {
  IS_FALSE = 'false',
  IS_TRUE = 'true',
}

export enum ProductFilterConditionsTranslations {
  IS_EQUAL_TO = 'isEqualTo',
  IS_LESS_THAN = 'isLessThan',
  IS_GREATER_THAN = 'isGreaterThan',
  IS_NOT_EQUAL_TO = 'isNotEqualTo',
  CONTAINS = 'contains',
  NOT_CONTAIN = 'notContain',
  IS_IN = 'isIn',
  IS_NOT = 'isNot',
}

export enum ProductFilterConditions {
  DOES_CONTAIN = 'does_contain',
  DOES_NOT_CONTAIN = 'does_not_contain',
  GREATER = 'greater',
  LOWER = 'lower',
  IS = 'is',
  IS_NOT = 'is_not',
}

export default {
  ProductFilterBooleanConditions,
  ProductFilterConditionsTranslations,
  ProductFilterConditions,
};
