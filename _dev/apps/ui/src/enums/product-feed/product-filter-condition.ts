export enum ProductFilterNumericConditions {
  IS_EQUAL_TO = 'isEqualTo',
  IS_LESS_THAN = 'isLessThan',
  IS_GREATER_THAN = 'isGreaterThan',
}

export enum ProductFilterStringConditions {
  CONTAINS = 'contains',
  NOT_CONTAIN = 'notContain',
  IS_IN = 'isIn',
  IS_NOT = 'isNot'
}

export enum ProductFilterBooleanConditions {
  IS_FALSE = 'isFalse',
  IS_TRUE = 'isTrue',
}

export enum ProductFilterFieldConditions {
  NUMERIC = 'numeric',
  STRING = 'string',
  MULTI_SELECT = 'multiSelect',
  BOOLEAN = 'boolean',
}

export default {
  ProductFilterNumericConditions,
  ProductFilterStringConditions,
  ProductFilterBooleanConditions,
  ProductFilterFieldConditions,
};
