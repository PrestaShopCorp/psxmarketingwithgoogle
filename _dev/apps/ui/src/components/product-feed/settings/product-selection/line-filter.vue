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
              v-for="(attribute, index) in defaultAttributesValues"
              :key="index"
              @click="() => {
                attributeSelected = attribute
                defaultAttributeIsSelected = true
                conditionSelected = ''
              }"
              :value="defautltAttributesValueSelected(attribute)"
            >
              <span>{{ defautltAttributesValueSelected(attribute) }}</span>
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
              v-for="(attribute, index) in featuresValuesArray"
              :key="index"
              @click="() => {
                attributeSelected = attribute
                defaultAttributeIsSelected = false
                conditionSelected = ''
              }"
              :value="attribute"
            >
              <span>{{ attribute }}</span>
            </b-dropdown-item>
          </b-dropdown-group>
        </b-dropdown>
        <!-- CONDITIONS -->
        <b-dropdown
          class="ps-dropdown psxmarketingwithgoogle-dropdown conditions"
          menu-class="ps-dropdown"
          :text="conditionSelected.length ? conditionValueSelected(conditionSelected) : undefined || $t('productFeedSettings.productSelection.lineFilter.condition.placeholder')"
          :disabled="!attributeSelected"
        >
          <b-dropdown-item
            v-for="(type, index) in typeOfConditionSelection"
            :key="index"
            @click="conditionSelected = type"
          >
            <span class="mr-2">
              {{ conditionValueSelected(type) }}
            </span>
          </b-dropdown-item>
        </b-dropdown>
        <!-- VALUE / NUMBER -->
        <b-input-group
          v-if="attributeSelected === 'price' || attributeSelected === 'productId'"
          class="field-number"
          :append="attributeSelected === 'price' ? currencySymbol : undefined"
        >
          <b-form-input
            type="number"
            min="0"
            :value="valueTypeNumber"
            :disabled="!conditionSelected.length"
            @change="valueTypeNumber = $event"
          />
        </b-input-group>
        <!-- VALUE / MULTI-SELECT -->
        <multi-select-value
          v-else-if="conditionSelected === 'isIn' || conditionSelected === 'isNot'"
          class="multi-select"
          :dropdown-options="productFilteredArray"
          :placeholder="placeholderMultiSelect"
          :disabled="!!!conditionSelected.length"
        />
        <!-- VALUE / FREE FIELD -->
        <!-- TODO : Réinitialiser le champ au on-change du champ attribut -->
        <input-text-with-tag
          :disabled="!!!conditionSelected.length"
          v-else-if="!!!conditionSelected.length || conditionSelected === 'contains' || conditionSelected === 'notContain'"
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
import {defineComponent} from 'vue';
import VueI18n from 'vue-i18n';
import MultiSelectValue from '@/components/commons/multi-select-value.vue';
import InputTextWithTag from '@/components/commons/input-text-with-tag.vue';
import ProductFilterDefaultAttributes from '@/enums/product-feed/product-filter-default-attributes';
import {
  ProductFilterFieldConditions,
  ProductFilterNumericConditions,
  ProductFilterStringConditions,
  ProductFilterBooleanConditions,
} from '@/enums/product-feed/product-filter-condition';
import featureMock from './features.json';
import productFilteredMock from './products-filtered.json';

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
  },
  data() {
    return {
      features: featureMock,
      defaultAttributeIsSelected: false,
      attributeSelected: '',
      conditionSelected: '',
      conditionTypeSelected: '',
      productFiltered: productFilteredMock,
      valueTypeNumber: 0,
    };
  },
  methods: {
    defautltAttributesValueSelected(label): VueI18n.TranslateResult {
      return this.$i18n.t(`productFeedSettings.productSelection.lineFilter.attributes.${label}`);
    },
    conditionValueSelected(label) {
      return this.$i18n.t(`productFeedSettings.productSelection.lineFilter.condition.${label}`);
    }
  },
  computed: {
    // Attribute Field
    defaultAttributesValues() {
      return Object.values(ProductFilterDefaultAttributes);
    },
    attributesValues() {
      if (this.attributeSelected) {
        if (this.defaultAttributeIsSelected) {
          return this.defautltAttributesValueSelected(this.attributeSelected);
        }
        return this.attributeSelected;
      }
      return this.$i18n.t('productFeedSettings.productSelection.lineFilter.attributes.placeholder');
    },
    featuresValuesArray() {
      return this.features.map((feature) => feature.key);
    },
    // Conditions
    typeOfConditionSelection() {
      switch (this.conditionTypeSelected) {
        case ProductFilterFieldConditions.NUMERIC:
          return Object.values(ProductFilterNumericConditions);
        case ProductFilterFieldConditions.STRING:
          return Object.values(ProductFilterStringConditions);
        case ProductFilterFieldConditions.BOOLEAN:
          return Object.values(ProductFilterBooleanConditions);
        default:
          return null;
      }
    },
    // Multi-select Field
    placeholderMultiSelect() {
      return this.$i18n.t('productFeedSettings.productSelection.lineFilter.value.selectValue') as string;
    },
    // Free input Field
    productFilteredArray() {
      return this.productFiltered.map((product) => product.value);
    },
    // Number Fied
    currency() {
      return this.$store.getters['app/GET_CURRENT_CURRENCY'];
    },
    currencySymbol(): string {
      return this.$options.filters?.formatPrice(0, this.currency).replace(/[\s.,0]*/g, '');
    },
  },
  watch: {
    attributeSelected() {
      if (this.defaultAttributeIsSelected) {
        if (this.attributeSelected === ProductFilterDefaultAttributes.PRICE
          || this.attributeSelected === ProductFilterDefaultAttributes.PRODUCT_ID) {
          this.conditionTypeSelected = ProductFilterFieldConditions.NUMERIC;
        } else if (this.attributeSelected === ProductFilterDefaultAttributes.BRAND
          || this.attributeSelected === ProductFilterDefaultAttributes.CATEGORY) {
          this.conditionTypeSelected = ProductFilterFieldConditions.STRING;
        } else if (ProductFilterDefaultAttributes.OUT_OF_STOCK) {
          this.conditionTypeSelected = ProductFilterFieldConditions.BOOLEAN;
        }
      } else {
        // TODO : Si les valeurs des features selectionné est un nombre
        // alors le champ condition doit être numérique
        this.conditionTypeSelected = ProductFilterFieldConditions.STRING;
      }
    },
  },
});
</script>
