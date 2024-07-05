import ATTRIBUTE_MAP_CONDITION from '@/components/product-feed/settings/product-selection/attributeMapCondition';
import {
  BrandOption, CategoryOption,
  CleanProductFilter, Feature, FeatureOption, FilterConditionConfig,
  ProductFilterErrors, ProductFilterValidatorOptions,
} from '@/components/product-feed/settings/product-selection/type';
import i18n from '@/lib/i18n';
import store from '@/store';
import ProductFilterValueType from '@/enums/product-feed/product-filter-value-type';
import ProductFilterAttributes from '@/enums/product-feed/product-filter-attributes';
import GetterTypes from '@/store/modules/product-feed/getters-types';
import {getFeatureByOptions} from '@/components/product-feed/settings/product-selection/product-selection-utilities';
import {AttributesTypes} from '@/store/modules/product-feed/state';
import {ProductFilterConditions} from '@/enums/product-feed/product-filter-condition';

class FilterValidator {
  attributeError: string | null;

  conditionError: string | null;

  valueError: string | null;

  valuesErrorMessage: string | null;

  valuesOnError: number[];

  options: ProductFilterValidatorOptions;

  filterError: boolean;

  constructor() {
    this.attributeError = null;
    this.conditionError = null;
    this.valueError = null;
    this.valuesErrorMessage = null;
    this.valuesOnError = [];
    this.filterError = false;
    // You must be careful to load the data correctly before using the validator
    this.options = {
      [ProductFilterAttributes.BRAND]: store.getters[`productFeed/${GetterTypes.GET_PRODUCT_FILTER_BRANDS_OPTIONS}`],
      [ProductFilterAttributes.CATEGORY]: store.getters[`productFeed/${GetterTypes.GET_PRODUCT_FILTER_CATEGORIES_OPTIONS}`],
      [ProductFilterAttributes.FEATURE]: store.getters[`productFeed/${GetterTypes.GET_PRODUCT_FILTER_FEATURES_OPTIONS}`],
    };
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

    if (this.valuesErrorMessage && this.valuesOnError.length > 0) {
      errors.value = this.valuesErrorMessage;
      errors.values = this.valuesOnError;
    }

    return errors;
  }

  public get isValid(): boolean {
    return !this.filterError
      && !this.attributeError
      && !this.conditionError
      && !this.valueError
      && !this.valuesErrorMessage
      && this.valuesOnError.length === 0;
  }

  public validate(filter: CleanProductFilter): void {
    // we stop validation if the filter is on error
    this.validateAttribute(filter);
    if (this.attributeError) {
      return;
    }

    this.validateCondition(filter);
    if (this.conditionError) {
      return;
    }

    this.validateValue(filter);
    if (this.valueError || this.valuesErrorMessage || this.valuesOnError.length > 0) {
      return;
    }

    this.validateFeature(filter);
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
    const conditionRequirements = ATTRIBUTE_MAP_CONDITION[filter.attribute][filter.condition];

    if (conditionRequirements.multiple) {
      if (!this.mustHaveSeveralValues(filter)) {
        return;
      }
    } else if (!this.mustHaveOneValue(filter)) {
      return;
    }

    // test depending on type
    switch (conditionRequirements.type) {
      case ProductFilterValueType.STRING:
        this.mustBeString(filter, conditionRequirements);
        break;
      case ProductFilterValueType.NUMBER:
        this.mustBeNumber(filter, conditionRequirements);
        if (conditionRequirements.positive && !this.valueError) {
          this.mustBePositiveNumber(filter, conditionRequirements);
        }
        if (conditionRequirements.integer && !this.valueError) {
          this.mustBeInteger(filter, conditionRequirements);
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

    if (
      [
        ProductFilterAttributes.FEATURE,
        ProductFilterAttributes.BRAND,
        ProductFilterAttributes.CATEGORY,
      ].includes(filter.attribute as ProductFilterAttributes)
      && [
        ProductFilterConditions.IS,
        ProductFilterConditions.IS_NOT,
      ].includes(filter.condition as ProductFilterConditions)
    ) {
      this.valueOptionExist(filter);
    }
  }

  private validateFeature(filter: CleanProductFilter) {
    // if we can't retrieve the feature we need to send error to wall filter
    if (filter.attribute === ProductFilterAttributes.FEATURE) {
      this.filterError = getFeatureByOptions(
        this.options[ProductFilterAttributes.FEATURE],
        filter.value as FeatureOption[],
      ) === undefined;
    }
  }

  private mustHaveSeveralValues(filter: CleanProductFilter): boolean {
    if (!Array.isArray(filter.value)) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
      return false;
    }

    if (filter.value.length === 0) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.empty') as string;
      return false;
    }

    return true;
  }

  private mustHaveOneValue(filter: CleanProductFilter): boolean {
    if (Array.isArray(filter.value)) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
      return false;
    }

    if (filter.value === undefined || filter.value === null) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.empty') as string;
      return false;
    }

    return true;
  }

  private mustBeString(filter: CleanProductFilter, conditionRequirements: FilterConditionConfig) {
    const isString = (value: any): boolean => typeof value === 'string';

    if (conditionRequirements.multiple && Array.isArray(filter.value)) {
      filter.value.forEach((value: any, index: number) => {
        if (!isString(value)) {
          if (!this.valuesOnError.find((el) => el === index)) {
            this.valuesErrorMessage = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
            this.valuesOnError.push(index);
          }
        }
      });
    } else if (!isString(filter.value)) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
    }
  }

  private mustBeNumber(filter: CleanProductFilter, conditionRequirements: FilterConditionConfig) {
    const isNumber = (value: any): boolean => !Number.isNaN(value)
      && !Number.isNaN(parseFloat(value));

    if (conditionRequirements.multiple && Array.isArray(filter.value)) {
      filter.value.forEach((value: any, index: number) => {
        if (!isNumber(value)) {
          if (!this.valuesOnError.find((el) => el === index)) {
            this.valuesErrorMessage = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidNumber') as string;
            this.valuesOnError.push(index);
          }
        }
      });
    } else if (!isNumber(filter.value)) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidNumber') as string;
    }
  }

  private mustBePositiveNumber(
    filter: CleanProductFilter,
    conditionRequirements: FilterConditionConfig,
  ) {
    const isPositiveNumber = (value: any): boolean => Number(value) > 0;

    if (conditionRequirements.multiple && Array.isArray(filter.value)) {
      filter.value.forEach((value: any, index: number) => {
        if (!isPositiveNumber(value)) {
          if (!this.valuesOnError.find((el) => el === index)) {
            this.valuesErrorMessage = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidPositiveNumber') as string;
            this.valuesOnError.push(index);
          }
        }
      });
    } else if (!isPositiveNumber(filter.value)) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidPositiveNumber') as string;
    }
  }

  private mustBeInteger(filter: CleanProductFilter, conditionRequirements: FilterConditionConfig) {
    const isInteger = (value: any): boolean => Number.isInteger(value)
      && !Number.isNaN(parseFloat(value));

    if (conditionRequirements.multiple && Array.isArray(filter.value)) {
      filter.value.forEach((value: any, index: number) => {
        if (!isInteger(value)) {
          if (!this.valuesOnError.find((el) => el === index)) {
            this.valuesErrorMessage = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidInteger') as string;
            this.valuesOnError.push(index);
          }
        }
      });
    } else if (!isInteger(filter.value)) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidInteger') as string;
    }
  }

  private mustBeBoolean(filter: CleanProductFilter, conditionRequirements: FilterConditionConfig) {
    const isBoolean = (value: any): boolean => typeof value === 'boolean';

    if (conditionRequirements.multiple && Array.isArray(filter.value)) {
      filter.value.forEach((value: any, index: number) => {
        if (!isBoolean(value)) {
          if (!this.valuesOnError.find((el) => el === index)) {
            this.valuesErrorMessage = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
            this.valuesOnError.push(index);
          }
        }
      });
    } else if (!isBoolean(filter.value)) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
    }
  }

  private mustBeObjectWithKeys(
    filter: CleanProductFilter,
    conditionRequirements: FilterConditionConfig,
  ) {
    const isObjectWithKeys = (value: any, keys: string[]): boolean => {
      if (typeof value !== 'object' || value === null) {
        return false;
      }
      return keys.every((key) => Object.keys(value).includes(key));
    };

    if (conditionRequirements.multiple && Array.isArray(filter.value)) {
      filter.value.forEach((value: any, index: number) => {
        if (conditionRequirements.keys && !isObjectWithKeys(value, conditionRequirements.keys)) {
          if (!this.valuesOnError.find((el) => el === index)) {
            this.valuesErrorMessage = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
            this.valuesOnError.push(index);
          }
        }
      });
    } else if (conditionRequirements.keys
      && !isObjectWithKeys(filter.value, conditionRequirements.keys)) {
      this.valueError = i18n.t('productFeedSettings.productSelection.lineFilter.errors.invalidEntry') as string;
    }
  }

  private valueOptionExist(filter: CleanProductFilter) {
    const optionExist = (
      option: BrandOption | CategoryOption | FeatureOption,
      optionsList: BrandOption[] | CategoryOption[] | FeatureOption[],
    ): boolean => optionsList.some((opt) => opt.id === option.id);

    let numberOfMissingOptions = 0;

    let optionsList = this.options[filter.attribute];

    if (filter.attribute === AttributesTypes.FEATURE) {
      const currentFeature = getFeatureByOptions(
        optionsList,
        filter.value as FeatureOption[],
      ) as Feature;
      optionsList = currentFeature.values;
    }

    (filter.value as BrandOption[] | CategoryOption[] | FeatureOption[])
      .forEach((option: BrandOption | CategoryOption | FeatureOption, index: number) => {
        if (!optionExist(option, optionsList)) {
          numberOfMissingOptions += 1;
          this.valuesOnError.push(index);
        }
      });

    if (numberOfMissingOptions > 0) {
      this.valuesErrorMessage = i18n.tc('productFeedSettings.productSelection.lineFilter.errors.valueDoNotExist', numberOfMissingOptions);
    }
  }
}

export default FilterValidator;
