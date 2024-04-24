<!-- eslint-disable max-len -->
<template>
  <div class="line-filter">
    <b-form>
      <div class="line-filter-field">
        <!-- ATTRIBUTES -->
        <div>
          <p class="mb-0 font-weight-500">
            {{ $t('productFeedSettings.productSelection.lineFilter.attributes.label') }}
          </p>
          <b-dropdown
            :text="attributesValues"
            class="psxmarketingwithgoogle-dropdown ps-dropdown attributes"
            :class="{'error-field': filters.errors?.attribute, 'h-100': !filters.errors?.value}"
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
                :value="getSelectedLabel('attributes', attribute)"
                @click="updateAttribute(attribute, true)"
              >
                <span>{{ getSelectedLabel('attributes', attribute.value) }}</span>
              </b-dropdown-item>
            </b-dropdown-group>
            <!-- CUSTOM ATTRIBUTES -->
            <b-dropdown-group v-if="featuresList.length">
              <template #header>
                <span>
                  {{ $t('productFeedSettings.productSelection.lineFilter.attributes.features') }}
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
            v-if="filters.errors?.attribute"
            class="error-message"
          >
            {{ filters.errors?.attribute }}
          </p>
        </div>

        <!-- CONDITIONS -->
        <div v-if="attributeSelected.value !== typeAttributes.OUT_OF_STOCK">
          <p
            class="mb-0 font-weight-500"
            :class="{'text-primary-500': !attributeSelected.value}"
          >
            {{ $t('productFeedSettings.productSelection.lineFilter.conditions.label') }}
          </p>
          <b-dropdown
            v-if="attributeSelected.value !== typeAttributes.OUT_OF_STOCK"
            class="ps-dropdown psxmarketingwithgoogle-dropdown conditions"
            :class="{'error-field': filters.errors?.condition, 'h-100': !filters.errors?.value}"
            menu-class="ps-dropdown"
            :text="conditionSelected.length ? getSelectedLabel('conditions', conditionSelected) : $t('productFeedSettings.productSelection.lineFilter.conditions.placeholder')"
            :disabled="!attributeSelected.value"
          >
            <b-dropdown-item
              v-for="(type, index) in typeOfConditionSelection"
              :key="index"
              @click="updateCondition(type)"
            >
              <span class="mr-2">
                {{ getSelectedLabel('conditions', type) }}
              </span>
            </b-dropdown-item>
          </b-dropdown>
          <p
            class="error-message"
            v-if="filters.errors?.condition"
          >
            {{ filters.errors?.condition }}
          </p>
        </div>
        <div>
          <p
            class="mb-0 font-weight-500"
            :class="{'text-primary-500': !conditionSelected.length && attributeSelected.value !== typeAttributes.OUT_OF_STOCK}"
          >
            {{ $t('productFeedSettings.productSelection.lineFilter.value.label') }}
          </p>
          <!-- VALUE / NUMBER -->
          <b-input-group
            v-if="attributeSelected.value === typeAttributes.PRICE"
            class="field-number"
            :class="{'error-field': filters.errors?.value}"
            :append="attributeSelected.value === typeAttributes.PRICE && currencySymbol !== 'en-gb' ? currencySymbol : undefined"
            :prepend="attributeSelected.value === typeAttributes.PRICE && currencySymbol === 'en-gb' ? currencySymbol : undefined"
          >
            <b-form-input
              type="number"
              min="0"
              :value="valueSelected"
              :disabled="!conditionSelected.length"
              @change="updateValue($event)"
            />
          </b-input-group>
          <!-- VALUE / BOOLEAN -->
          <b-dropdown
            v-if="attributeSelected.value === typeAttributes.OUT_OF_STOCK"
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
            v-else-if="conditionSelected === typeStringCondition.IS_IN || conditionSelected === typeStringCondition.IS_NOT"
            class="multi-select"
            :class="{'error-field': filters.errors?.value}"
            :dropdown-options="productFiltered"
            :placeholder="placeholderMultiSelect"
            :disabled="!conditionSelected.length"
            :default-value="valuesSelected"
            @dataUpdated="updateValues($event)"
          />
          <!-- VALUE / FREE FIELD -->
          <input-text-with-tag
            v-else-if="
              attributeSelected.value !== typeAttributes.PRICE && !conditionSelected.length || attributeSelected.value === typeAttributes.PRODUCT_ID || conditionSelected === typeStringCondition.CONTAINS
                || conditionSelected === typeStringCondition.NOT_CONTAIN"
            :disabled="!conditionSelected.length"
            :default-value="valuesSelected"
            :class="{'error-field': filters.errors?.value}"
            @dataUpdated="updateValues($event)"
          />
          <p
            class="error-message"
            v-if="filters.errors?.value"
          >
            {{ filters.errors?.value }}
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
import ProductFilterDefaultAttributes from '@/enums/product-feed/product-filter-default-attributes';
import {
  ProductFilterBooleanConditions,
  ProductFilterFieldConditions,
  ProductFilterNumericConditions,
  ProductFilterNumericArrayConditions,
  ProductFilterStringConditions,
} from '@/enums/product-feed/product-filter-condition';
import featureMock from './features.json';
import categoryOrBrand from './categoryOrBrand.json';
import {
  ProductFilter, Attribute, ProductFilterValue, ProductFilterValues,
} from './type';

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
      features: featureMock,
      defaultAttributeIsSelected: false,
      typeAttributes: ProductFilterDefaultAttributes,
      attributeSelected: {id: '', value: ''},
      typeStringCondition: ProductFilterStringConditions,
      conditionSelected: '',
      conditionTypeSelected: '',
      valueSelected: null as ProductFilterValue,
      valuesSelected: [] as string[],
    };
  },
  methods: {
    updateAttribute(attribute: Attribute, isDefault: boolean) {
      this.attributeSelected = attribute;
      this.defaultAttributeIsSelected = isDefault;
      this.updateCondition('');
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
    updateValues(values: string[]) {
      this.valuesSelected = values;
      this.onDataUpdate();
    },
    getSelectedLabel(field, item) {
      return this.$i18n.t(`productFeedSettings.productSelection.lineFilter.${field}.${item}`);
    },
    onDataUpdate() {
      this.$emit('dataUpdated', {
        attribute: this.attributeSelected.id,
        condition: this.conditionSelected,
        conditionType: this.conditionTypeSelected,
        value: this.valueSelected,
        values: this.valuesSelected,
      });
    },
    // TODO
    // getValuesOfFeaturesByLanguage() {
    //   const result: string[] = [];
    //   this.features.forEach((feature) => {
    //     feature.values.forEach((value) => {
    //       if (value.language === this.$i18n.locale.toLowerCase()) {
    //         result.push(value.value);
    //       }
    //     });
    //   });
    //   return result;
    // },
  },
  computed: {
    // Attribute Field
    defaultAttributesList() {
      return Object.values(ProductFilterDefaultAttributes).map(
        (attribute) => ({id: attribute, value: attribute}));
    },
    attributesValues() {
      if (this.attributeSelected.value) {
        if (this.defaultAttributeIsSelected) {
          return this.getSelectedLabel('attributes', this.attributeSelected.value);
        }
        return this.attributeSelected.value;
      }
      return this.$i18n.t('productFeedSettings.productSelection.lineFilter.attributes.placeholder');
    },
    featuresList() {
      return this.features.map((feature) => ({id: feature.id, value: feature.key}));
    },
    // Conditions
    typeOfConditionSelection() {
      switch (this.conditionTypeSelected) {
        case ProductFilterFieldConditions.NUMERIC:
          return Object.values(ProductFilterNumericConditions);
        case ProductFilterFieldConditions.STRING:
          return Object.values(ProductFilterStringConditions);
        case ProductFilterFieldConditions.NUMERIC_ARRAY:
          return Object.values(ProductFilterNumericArrayConditions);
        default:
          return null;
      }
    },
    // Multi-select Field
    placeholderMultiSelect() {
      return this.$i18n.t('productFeedSettings.productSelection.lineFilter.value.selectValue') as string;
    },
    productFiltered(): ProductFilterValues[] {
      if (this.attributeSelected.id === ProductFilterDefaultAttributes.BRAND
        || this.attributeSelected.id === ProductFilterDefaultAttributes.CATEGORY) {
        return categoryOrBrand.map((value) => value);
      }
      // TODO: gestion des features
      // if (!this.defaultAttributeIsSelected) {
      //   return this.getValuesOfFeaturesByLanguage();
      // }
      return [];
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
  watch: {
    attributeSelected() {
      if (this.defaultAttributeIsSelected) {
        if (this.attributeSelected.id === ProductFilterDefaultAttributes.PRICE) {
          this.conditionTypeSelected = ProductFilterFieldConditions.NUMERIC;
        } else if (this.attributeSelected.id === ProductFilterDefaultAttributes.PRODUCT_ID) {
          this.conditionTypeSelected = ProductFilterFieldConditions.NUMERIC_ARRAY;
        } else if (this.attributeSelected.id === ProductFilterDefaultAttributes.BRAND
          || this.attributeSelected.id === ProductFilterDefaultAttributes.CATEGORY) {
          this.conditionTypeSelected = ProductFilterFieldConditions.STRING;
        }
      } else {
        this.conditionTypeSelected = ProductFilterFieldConditions.STRING;
      }
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
          (el) => el.id === this.$props.filters.attribute,
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
