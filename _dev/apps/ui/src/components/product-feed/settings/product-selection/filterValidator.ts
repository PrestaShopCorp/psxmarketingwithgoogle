import ATTRIBUTE_MAP_CONDITION from '@/components/product-feed/settings/product-selection/attributeMapCondition';
import {
  CleanProductFilter,
  ProductFilterErrors,
} from '@/components/product-feed/settings/product-selection/type';
import i18n from '@/lib/i18n';
import ProductFilterValueType from '@/enums/product-feed/product-filter-value-type';

class FilterValidator {
  attributeError: string | null;

  conditionError: string | null;

  valueError: string | null;

  constructor() {
    this.attributeError = null;
    this.conditionError = null;
    this.valueError = null;
  }

  public get errors(): ProductFilterErrors {
    const errors: ProductFilterErrors = {};

    if (this.attributeError) {
      errors.attribute = this.attributeError;
    }

    if (this.conditionError) {
      errors.condition = this.conditionError;
    }

    if (this.valueError) {
      errors.value = this.valueError;
    }

    return errors;
  }

  public get isValid(): boolean {
    return !this.attributeError && !this.conditionError && !this.valueError;
  }

  public validate(filter: CleanProductFilter): void {
    this.validateAttribute(filter);
    this.validateCondition(filter);
    this.validateValue(filter);
  }

  private validateAttribute(filter: CleanProductFilter) {
    if (!filter.attribute) {
      this.attributeError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.empty') as string;
      return;
    }

    if (!(Object.keys(ATTRIBUTE_MAP_CONDITION).includes(filter.attribute))) {
      this.attributeError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
    }
  }

  private validateCondition(filter: CleanProductFilter) {
    if (!filter.condition) {
      this.conditionError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.empty') as string;
      return;
    }

    const attributeConditions = ATTRIBUTE_MAP_CONDITION[filter.attribute];

    if (!(Object.keys(attributeConditions).includes(filter.condition))) {
      this.attributeError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
    }
  }

  private validateValue(filter: CleanProductFilter) {
    if (this.attributeError || this.conditionError) {
      this.mustHaveOneValue(filter);
      return;
    }

    const conditionRequirements = ATTRIBUTE_MAP_CONDITION[filter.attribute][filter.condition];

    if (conditionRequirements.multiple) {
      if (!this.mustHaveSeveralValues(filter)) {
        return;
      }
    }

    if (!conditionRequirements.multiple && !filter.value) {
      if (!this.mustHaveOneValue(filter)) {
        return;
      }
    }

    switch (conditionRequirements.type) {
      case ProductFilterValueType.STRING:
        this.mustBeString(filter, conditionRequirements);
        break;
      case ProductFilterValueType.INT:
        this.mustBeNumber(filter, conditionRequirements);
        if (conditionRequirements.positive && !this.valueError) {
          this.mustBePositiveNumber(filter, conditionRequirements);
        }
        break;
      case ProductFilterValueType.BOOLEAN:
        this.mustBeBoolean(filter, conditionRequirements);
        break;
      case ProductFilterValueType.OBJECT:
        this.mustBeObjectWithKeys(filter, conditionRequirements);
        break;
      default:
    }
  }

  private mustHaveSeveralValues(filter: CleanProductFilter): boolean {
    if (filter.value || !filter.values || !Array.isArray(filter.values)) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
      return false;
    }

    if (filter.values.length === 0) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.empty') as string;
      return false;
    }

    return true;
  }

  private mustHaveOneValue(filter: CleanProductFilter): boolean {
    if (filter.values) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
      return false;
    }

    if (filter.value === undefined || filter.value === null) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.empty') as string;
      return false;
    }

    return true;
  }

  private mustBeString(filter: CleanProductFilter, conditionRequirements) {
    const isString = function (value: any): boolean {
      return typeof value === 'string';
    };

    if (conditionRequirements.multiple && filter.values) {
      filter.values.some((value: any) => {
        if (!isString(value)) {
          this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
          return true; // This will stop iteration
        }
        return false;
      });
    }

    if (!conditionRequirements.multiple) {
      if (!isString(filter.value)) {
        this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
      }
    }
  }

  private mustBeNumber(filter: CleanProductFilter, conditionRequirements) {
    const isNumber = function (value: any): boolean {
      return !Number.isNaN(value) && !Number.isNaN(parseFloat(value));
    };

    if (conditionRequirements.multiple && filter.values) {
      filter.values.some((value: any) => {
        if (!isNumber(value)) {
          this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidNumber') as string;
          return true; // This will stop iteration
        }
        return false;
      });
    }

    if (!conditionRequirements.multiple) {
      if (!isNumber(filter.value)) {
        this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidNumber') as string;
      }
    }
  }

  private mustBePositiveNumber(filter: CleanProductFilter, conditionRequirements) {
    const isPositiveNumber = function (value: any): boolean {
      return Number(value) >= 0;
    };

    if (conditionRequirements.multiple && filter.values) {
      filter.values.some((value: any) => {
        if (!isPositiveNumber(value)) {
          this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidPositiveNumber') as string;
          return true; // This will stop iteration
        }
        return false;
      });
    }

    if (!conditionRequirements.multiple) {
      if (!isPositiveNumber(filter.value)) {
        this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidPositiveNumber') as string;
      }
    }
  }

  private mustBeBoolean(filter: CleanProductFilter, conditionRequirements) {
    const isBoolean = function (value: any): boolean {
      return typeof value === 'boolean';
    };

    if (conditionRequirements.multiple && filter.values) {
      filter.values.some((value: any) => {
        if (!isBoolean(value)) {
          this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
          return true; // This will stop iteration
        }
        return false;
      });
    }

    if (!conditionRequirements.multiple) {
      if (!isBoolean(filter.value)) {
        this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
      }
    }
  }

  private mustBeObjectWithKeys(filter: CleanProductFilter, conditionRequirements) {
    const isObjectWithKeys = function (value: any, keys: string[]): boolean {
      if (typeof value !== 'object' || value === null) {
        return false;
      }
      return keys.every((key) => Object.keys(value).includes(key));
    };

    if (conditionRequirements.multiple && filter.values) {
      filter.values.some((value: any) => {
        if (!isObjectWithKeys(value, conditionRequirements.keys)) {
          this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
          return true; // This will stop iteration
        }
        return false;
      });
    }

    if (!conditionRequirements.multiple) {
      if (!isObjectWithKeys(filter.value, conditionRequirements.keys)) {
        this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
      }
    }
  }
}

export default FilterValidator;
