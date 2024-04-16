<!-- eslint-disable max-len -->
<template>
  <div class="line-filter">
    <b-form>
      <div class="d-md-flex text-center">
        <!-- ATTRIBUTES -->
        <b-dropdown
          :text="attributesValues"
          class="psxmarketingwithgoogle-dropdown ps-dropdown attributes"
          menu-class="ps-dropdown"
        >
          <!-- DEFAULTS ATTRIBUTES -->
          <b-dropdown-group>
            <template #header>
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
              v-model="attributeSelected.id"
              @click="() => {
                attributeSelected = attribute
                defaultAttributeIsSelected = true
                conditionSelected = ''
                valueSelected = null
                onDataUpdate()
              }"
            >
              <span>{{ getSelectedLabel('attributes', attribute.value) }}</span>
            </b-dropdown-item>
          </b-dropdown-group>
          <!-- CUSTOM ATTRIBUTES -->
          <b-dropdown-group>
            <template #header>
              <span>
                {{ $t('productFeedSettings.productSelection.lineFilter.attributes.features') }}
              </span>
            </template>

            <b-dropdown-item
              v-for="(feature, index) in featuresList"
              :key="index"
              @click="() => {
                attributeSelected = feature
                defaultAttributeIsSelected = false
                conditionSelected = ''
                valueSelected = null
                onDataUpdate()
              }"
              :value="feature"
            >
              <span>{{ feature.value }}</span>
            </b-dropdown-item>
          </b-dropdown-group>
        </b-dropdown>
        <!-- CONDITIONS -->
        <b-dropdown
          v-if="attributeSelected.value !== 'outOfStock'"
          class="ps-dropdown psxmarketingwithgoogle-dropdown conditions"
          menu-class="ps-dropdown"
          :text="conditionSelected.length ? getSelectedLabel('conditions', conditionSelected) : undefined || $t('productFeedSettings.productSelection.lineFilter.conditions.placeholder')"
          :disabled="!attributeSelected.value"
        >
          <b-dropdown-item
            v-for="(type, index) in typeOfConditionSelection"
            :key="index"
            @click="() => {
              conditionSelected = type
              valueSelected = null
              onDataUpdate()
            }"
          >
            <span class="mr-2">
              {{ getSelectedLabel('conditions', type) }}
            </span>
          </b-dropdown-item>
        </b-dropdown>
        <!-- VALUE / NUMBER -->
        <b-input-group
          v-if="attributeSelected.value === 'price' || attributeSelected.value === 'productId'"
          class="field-number"
          :append="attributeSelected.value === 'price' ? currencySymbol : undefined"
        >
          <b-form-input
            type="number"
            min="0"
            :value="valueSelected"
            :disabled="!conditionSelected.length"
            @change="valueSelected = $event"
            @input="onDataUpdate"
          />
        </b-input-group>
        <!-- VALUE / BOOLEAN -->
        <b-dropdown
          v-if="attributeSelected.value === 'outOfStock'"
          class="ps-dropdown psxmarketingwithgoogle-dropdown value-boolean"
          menu-class="ps-dropdown"
          :text="valueSelected ? getSelectedLabel('value', valueSelected) : $t('productFeedSettings.productSelection.lineFilter.conditions.placeholder')"
        >
          <b-dropdown-item
            v-for="(type, index) in booleanList"
            :key="index"
            @click="() => {
              valueSelected = type
              onDataUpdate()
            }"
          >
            <span class="mr-2">
              {{ getSelectedLabel('value', type) }}
            </span>
          </b-dropdown-item>
        </b-dropdown>
        <!-- VALUE / MULTI-SELECT -->
        <multi-select-value
          v-else-if="conditionSelected === 'isIn' || conditionSelected === 'isNot'"
          class="multi-select"
          :dropdown-options="productFiltered"
          :placeholder="placeholderMultiSelect"
          :disabled="!!!conditionSelected.length"
          @dataUpdated="onDataMultiSelectUpdate($event)"
        />
        <!-- VALUE / FREE FIELD -->
        <!-- TODO : Réinitialiser le champ au on-change du champ attribut -->
        <input-text-with-tag
          :disabled="!!!conditionSelected.length"
          v-else-if="
            attributeSelected.value !== 'price'
              && attributeSelected.value !== 'productId'
              && !!!conditionSelected.length
              || conditionSelected === 'contains'
              || conditionSelected === 'notContain'"
        />
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
  ProductFilterStringConditions,
} from '@/enums/product-feed/product-filter-condition';
import featureMock from './features.json';
import categoryOrBrand from './categoryOrBrand.json';
import {ProductFilter} from './type';

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
      type: Array as PropType<ProductFilter[]>,
      required: true,
    },
  },
  data() {
    return {
      features: featureMock,
      defaultAttributeIsSelected: false,
      attributeSelected: {id: '', value: ''},
      conditionSelected: '',
      conditionTypeSelected: '',
      valueSelected: null as string|number|boolean|null,
    };
  },
  methods: {
    getSelectedLabel(field, item) {
      return this.$i18n.t(`productFeedSettings.productSelection.lineFilter.${field}.${item}`);
    },
    onDataUpdate() {
      this.$emit('dataUpdated', [{
        attribute: this.attributeSelected.id,
        condition: this.conditionSelected,
        value: this.valueSelected,
      }]);
    },
    onDataMultiSelectUpdate(event) {
      console.log('event', event);
    },
    getValuesOfFeaturesByLanguage() {
      const result: string[] = [];
      this.features.forEach((feature) => {
        feature.values.forEach((value) => {
          if (value.language === this.$i18n.locale.toLowerCase()) {
            result.push(value.value);
          }
        });
      });
      return result;
    },
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
        default:
          return null;
      }
    },
    // Multi-select Field
    placeholderMultiSelect() {
      return this.$i18n.t('productFeedSettings.productSelection.lineFilter.value.selectValue') as string;
    },
    productFiltered(): string[] {
      if (this.attributeSelected.id === ProductFilterDefaultAttributes.BRAND
        || this.attributeSelected.id === ProductFilterDefaultAttributes.CATEGORY) {
        return categoryOrBrand.map((value) => value.value);
      }
      if (this.defaultAttributeIsSelected === false) {
        return this.getValuesOfFeaturesByLanguage();
      }
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
        if (this.attributeSelected.id === ProductFilterDefaultAttributes.PRICE
          || this.attributeSelected.id === ProductFilterDefaultAttributes.PRODUCT_ID) {
          this.conditionTypeSelected = ProductFilterFieldConditions.NUMERIC;
        } else if (this.attributeSelected.id === ProductFilterDefaultAttributes.BRAND
          || this.attributeSelected.id === ProductFilterDefaultAttributes.CATEGORY) {
          this.conditionTypeSelected = ProductFilterFieldConditions.STRING;
        }
      } else {
        this.conditionTypeSelected = ProductFilterFieldConditions.STRING;
      }
    },
  },
});
</script>
