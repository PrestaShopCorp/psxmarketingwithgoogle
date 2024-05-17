<!-- eslint-disable max-len -->
<template>
  <div class="line-filter">
    <b-form @submit.prevent="">
      <div class="line-filter-field">
        <!-- ATTRIBUTES -->
        <div>
          <p class="mb-0 font-weight-500">
            {{ $t('productFeedSettings.productSelection.lineFilter.attributes.label') }}
          </p>
          <b-dropdown
            :text="currentAttributesValue"
            class="psxmarketingwithgoogle-dropdown ps-dropdown attributes h-100"
            :class="{'error-field': filters.errors?.attribute}"
            menu-class="ps-dropdown"
          >
            <!-- DEFAULTS ATTRIBUTES -->
            <b-dropdown-group>
              <template
                v-if="featuresList.length"
                #header
              >
                <span>
                  {{
                    $t('productFeedSettings.productSelection.lineFilter.attributes.defaultAttributes')
                  }}
                </span>
              </template>

              <b-dropdown-item
                v-for="(attribute, index) in defaultAttributesList"
                :key="index"
                :value="getSelectedLabel('attributes', attribute.value )"
                @click="updateAttribute(attribute, true)"
              >
                <span>{{ getSelectedLabel('attributes', attribute.value) }}</span>
              </b-dropdown-item>
            </b-dropdown-group>
            <!-- CUSTOM ATTRIBUTES -->
            <b-dropdown-group v-if="featuresList.length">
              <template #header>
                <span>
                  {{ $tc('productFeedSettings.productSelection.lineFilter.attributes.features', features.length) }}
                </span>
              </template>

              <b-dropdown-item
                v-for="(feature, index) in featuresList"
                :key="index"
                @click="updateAttribute(feature, false)"
                :value="feature"
              >
                <span>{{ feature.value }}</span>
              </b-dropdown-item>
            </b-dropdown-group>
          </b-dropdown>
          <p
            v-if="hasError"
            class="error-message"
          >
            {{ filters.errors?.attribute || '&nbsp;' }}
          </p>
        </div>

        <!-- CONDITIONS -->
        <div v-if="displayCondition">
          <p
            class="mb-0 font-weight-500"
            :class="{'text-primary-500': !attributeSelected.id}"
          >
            {{ $t('productFeedSettings.productSelection.lineFilter.conditions.label') }}
          </p>
          <b-dropdown
            class="ps-dropdown psxmarketingwithgoogle-dropdown conditions h-100"
            :class="{'error-field': filters.errors?.condition}"
            menu-class="ps-dropdown"
            :text="conditionSelected ? getSelectedLabel('conditions', availableAttributeConditions[conditionSelected].translation) : $t('productFeedSettings.productSelection.lineFilter.conditions.placeholder')"
            :disabled="!attributeSelected.value"
          >
            <b-dropdown-item
              v-for="(condition, key) in availableAttributeConditions"
              :key="key"
              :value="key"
              @click="updateCondition(key)"
            >
              <span class="mr-2">
                {{ getSelectedLabel('conditions', condition.translation) }}
              </span>
            </b-dropdown-item>
          </b-dropdown>
          <p
            class="error-message"
            v-if="hasError"
          >
            {{ filters.errors?.condition || '&nbsp;' }}
          </p>
        </div>
        <div>
          <p
            class="mb-0 font-weight-500"
            :class="{'text-primary-500': !conditionSelected }"
          >
            {{ displayCondition ? $t('productFeedSettings.productSelection.lineFilter.value.label') : $t('productFeedSettings.productSelection.lineFilter.conditions.label') }}
          </p>
          <!-- VALUE / NUMBER -->
          <b-input-group
            v-if="displayInputNumber"
            class="field-number"
            :class="{'error-field': filters.errors?.value}"
            :append="attributeSelected.value === ProductFilterAttributes.PRICE && currentCountry !== 'gb' ? currencySymbol : undefined"
            :prepend="attributeSelected.value === ProductFilterAttributes.PRICE && currentCountry === 'gb' ? currencySymbol : undefined"
          >
            <b-form-input
              type="number"
              min="0"
              :value="valueSelected"
              :disabled="!conditionSelected.length"
              @input="updateValue($event)"
            />
          </b-input-group>
          <!-- VALUE / BOOLEAN -->
          <b-dropdown
            v-if="displayBoolSelect"
            class="ps-dropdown psxmarketingwithgoogle-dropdown value-boolean"
            :class="{'error-field': filters.errors?.value}"
            menu-class="ps-dropdown"
            :text="valueSelected ? getSelectedLabel('value', valueSelected) : $t('productFeedSettings.productSelection.lineFilter.conditions.placeholder')"
          >
            <b-dropdown-item
              v-for="(type, index) in booleanList"
              :key="index"
              @click="updateValue(type)"
            >
              <span class="mr-2">
                {{ getSelectedLabel('value', type) }}
              </span>
            </b-dropdown-item>
          </b-dropdown>
          <!-- VALUE / MULTI-SELECT -->
          <multi-select-value
            v-else-if="displayMultiSelect"
            class="multi-select"
            :class="{'error-field': filters.errors?.value}"
            :dropdown-options="currentAttributeOptions"
            :placeholder="placeholderMultiSelect"
            :disabled="!conditionSelected.length"
            :default-value="valuesSelected"
            @dataUpdated="updateValues($event)"
          />
          <!-- VALUE / FREE FIELD -->
          <input-text-with-tag
            v-else-if="displayFreeField"
            :disabled="!conditionSelected.length"
            :default-value="valuesSelected"
            :class="{'error-field': filters.errors?.value}"
            @dataUpdated="updateValues($event)"
          />
          <p
            class="error-message"
            v-if="hasError"
          >
            {{ filters.errors?.value || '&nbsp;' }}
          </p>
        </div>
      </div>
    </b-form>
    <button
      :class="{'disabled': deleteButtonDisabled}"
      :disabled="deleteButtonDisabled"
      class="delete-filter"
      @click="$emit('clickToDeleteFilter')"
    >
      <i class="material-icons ps_gs-fz-20">delete</i>
    </button>
  </div>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';
import MultiSelectValue from '@/components/commons/multi-select-value.vue';
import InputTextWithTag from '@/components/commons/input-text-with-tag.vue';
import ProductFilterAttributes from '@/enums/product-feed/product-filter-attributes';
import {
  ProductFilterBooleanConditions,
} from '@/enums/product-feed/product-filter-condition';
import type {
  ProductFilter, Attribute, ProductFilterValue, ProductFilterValues,
  Feature,
} from './type';
import ProductFilterValueType from '@/enums/product-feed/product-filter-value-type';
import GetterTypes from '@/store/modules/product-feed/getters-types';
import ATTRIBUTE_MAP_CONDITION from './attributeMapCondition';

export default defineComponent({
  name: 'LineFilter',
  components: {
    MultiSelectValue,
    InputTextWithTag,
  },
  props: {
    deleteButtonDisabled: {
      type: Boolean,
      required: false,
    },
    filters: {
      type: Object as PropType<ProductFilter>,
      required: true,
    },
  },
  data() {
    return {
      ProductFilterAttributes,
      defaultAttributeIsSelected: false,
      attributeSelected: {id: '', value: ''} as Attribute,
      conditionSelected: '',
      valueSelected: null as ProductFilterValue,
      valuesSelected: [] as ProductFilterValues,
    };
  },
  methods: {
    updateAttribute(attribute: Attribute, isDefault: boolean) {
      this.attributeSelected = attribute;
      this.defaultAttributeIsSelected = isDefault;
      this.updateCondition('');

      // necessary cause if we got only one condition we don't display the condition field;
      if (!this.displayCondition) {
        this.updateCondition(Object.keys(ATTRIBUTE_MAP_CONDITION[attribute.value])[0]);
      }
    },
    updateCondition(condition: string) {
      this.conditionSelected = condition;
      this.updateValue(null);
      this.updateValues([]);
    },
    updateValue(value: ProductFilterValue) {
      this.valueSelected = value;
      this.onDataUpdate();
    },
    updateValues(values: ProductFilterValues) {
      this.valuesSelected = values;
      this.onDataUpdate();
    },
    getSelectedLabel(field: string, item: string) {
      return this.$i18n.t(`productFeedSettings.productSelection.lineFilter.${field}.${item}`);
    },
    onDataUpdate() {
      this.$emit('dataUpdated', {
        attribute: this.attributeSelected.id,
        condition: this.conditionSelected,
        value: this.valueSelected,
        values: this.valuesSelected,
      });
    },
  },
  computed: {
    currentCountry(): string {
      return window.i18nSettings.isoCode;
    },
    hasError(): Boolean {
      return !!this.filters.errors?.attribute
        || !!this.filters.errors?.condition
        || !!this.filters.errors?.value;
    },
    // Features
    features(): Feature[] {
      return this.$store.getters[`productFeed/${GetterTypes.GET_PRODUCT_FILTER_FEATURES_OPTIONS}`];
    },
    featuresList() {
      return this.features.map((feature) => ({id: feature.id, value: feature.key}));
    },

    // Attribute
    defaultAttributesList() {
      const attributes = Object
        .keys(ATTRIBUTE_MAP_CONDITION)
        .filter((val) => val !== ProductFilterAttributes.FEATURE);

      return Object.values(attributes).map(
        (attribute) => ({id: attribute, value: attribute}));
    },
    currentAttributesValue() {
      if (this.attributeSelected.value) {
        if (this.defaultAttributeIsSelected) {
          return this.getSelectedLabel('attributes', this.attributeSelected.value);
        }
        return this.attributeSelected.value;
      }
      return this.$i18n.t('productFeedSettings.productSelection.lineFilter.attributes.placeholder');
    },
    currentAttributeType() {
      if (this.defaultAttributeIsSelected) {
        return this.attributeSelected.id;
      }
      return ProductFilterAttributes.FEATURE;
    },

    // Conditions
    displayCondition() {
      return !this.attributeSelected
        || Object.keys(ATTRIBUTE_MAP_CONDITION[this.currentAttributeType]).length > 1;
    },
    availableAttributeConditions() {
      return this.defaultAttributeIsSelected
        ? ATTRIBUTE_MAP_CONDITION[this.attributeSelected.value]
        : ATTRIBUTE_MAP_CONDITION[ProductFilterAttributes.FEATURE];
    },

    // Fields
    displayInputNumber() {
      return ATTRIBUTE_MAP_CONDITION[this.currentAttributeType][this.conditionSelected]?.type
        === ProductFilterValueType.INT
        && !ATTRIBUTE_MAP_CONDITION[this.currentAttributeType][this.conditionSelected]?.multiple;
    },
    displayBoolSelect() {
      return ATTRIBUTE_MAP_CONDITION[this.currentAttributeType][this.conditionSelected]?.type
        === ProductFilterValueType.BOOLEAN;
    },
    displayMultiSelect() {
      return ATTRIBUTE_MAP_CONDITION[this.currentAttributeType][this.conditionSelected]?.type
        === ProductFilterValueType.OBJECT;
    },
    displayFreeField() {
      return !this.attributeSelected.value
        || !this.conditionSelected
        || ([ProductFilterValueType.STRING, ProductFilterValueType.INT]
          // eslint-disable-next-line max-len
          .includes(ATTRIBUTE_MAP_CONDITION[this.currentAttributeType][this.conditionSelected]?.type)
        && ATTRIBUTE_MAP_CONDITION[this.currentAttributeType][this.conditionSelected].multiple);
    },
    // Multi-select Field
    placeholderMultiSelect() {
      return this.$i18n.t('productFeedSettings.productSelection.lineFilter.value.selectValue') as string;
    },
    currentAttributeOptions(): ProductFilterValues {
      switch (this.currentAttributeType) {
        case ProductFilterAttributes.BRAND:
          return this.$store.getters[`productFeed/${GetterTypes.GET_PRODUCT_FILTER_BRANDS_OPTIONS}`];
        case ProductFilterAttributes.CATEGORY:
          return this.$store.getters[`productFeed/${GetterTypes.GET_PRODUCT_FILTER_CATEGORIES_OPTIONS}`];
        case ProductFilterAttributes.FEATURE:
          return this.features.find((el: Feature) => el.id === this.attributeSelected.id)
            ?.values.filter((option) => option.language === this.currentCountry)
            || [];
        default:
          return [];
      }
    },
    // Number Fied
    currency() {
      return this.$store.getters['app/GET_CURRENT_CURRENCY'];
    },
    currencySymbol(): string {
      return this.$options.filters?.formatPrice(0, this.currency).replace(/[\s.,0]*/g, '');
    },
    // Boolean Field
    booleanList() {
      return Object.values(ProductFilterBooleanConditions);
    },
  },
  mounted() {
    if (this.$props.filters.attribute) {
      const defaultAttribute = this.defaultAttributesList.find(
        (el) => el.id === this.$props.filters.attribute,
      );

      if (defaultAttribute) {
        this.updateAttribute(defaultAttribute, true);
      } else {
        const featureAttribute = this.featuresList.find(
          (el) => Number(el.id) === Number(this.$props.filters.attribute),
        );

        if (featureAttribute) {
          this.updateAttribute(featureAttribute, false);
        }
      }
    }

    if (this.$props.filters.condition) {
      this.updateCondition(this.$props.filters.condition);
    }

    if (this.$props.filters.value) {
      this.updateValue(this.$props.filters.value);
    }
    if (this.$props.filters.values) {
      this.updateValues(this.$props.filters.values);
    }
  },
});
</script>
