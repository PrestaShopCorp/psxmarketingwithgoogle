<!-- eslint-disable max-len -->
<template>
  <div class="gs-product-selection">
    <h3 class="font-weight-600">
      {{ $t('productFeedSettings.productSelection.methodSynch.title') }}
    </h3>
    <div class="container-fluid">
      <div class="row methods-sync ps_gs-radio">
        <div
          class="col col-12 col-md border-primary-400 p-3"
          :class="{'checked': synchSelected === typeMethodsSynch.SYNCH_ALL_PRODUCT}"
        >
          <b-form-radio
            v-model="synchSelected"
            name="customSyncRadio"
            value="synchAllProducts"
          >
            <h3 class="font-weight-700 mb-2 ps_gs-fz-14">
              {{ $t('productFeedSettings.productSelection.methodSynch.synchAllProducts') }}
            </h3>
            <span class="text-muted">
              {{ $t('productFeedSettings.productSelection.methodSynch.synchAllProductsDesc') }}
            </span>
          </b-form-radio>
        </div>
        <div
          class="col col-12 col-md border-primary-400 p-3 ml-md-1 mt-1 mt-md-0"
          :class="{'checked': synchSelected === typeMethodsSynch.SYNCH_FILTERED_PRODUCT}"
        >
          <div>
            <b-form-radio
              v-model="synchSelected"
              name="customSyncRadio"
              value="synchFilteredProducts"
            >
              <h3 class="font-weight-700 mb-2 ps_gs-fz-14">
                {{ $t('productFeedSettings.productSelection.methodSynch.synchFilteredProducts') }}
              </h3>
              <span class="text-muted">
                {{
                  $t('productFeedSettings.productSelection.methodSynch.synchFilteredProductsDesc')
                }}
              </span>
            </b-form-radio>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="synchSelected === typeMethodsSynch.SYNCH_FILTERED_PRODUCT"
      class="filters"
    >
      <div
        v-for="(filters, index) in listFilters"
        :key="filters.id"
      >
        <div
          class="separator"
          v-if="index !== 0"
        >
          <hr>
          <span>{{ $t('productFeedSettings.productSelection.and') }}</span>
          <hr>
        </div>
        <line-filter
          :delete-button-disabled="listFilters.length === 1"
          @clickToDeleteFilter="deleteFilter(index)"
          @dataUpdated="updateFilter($event, index)"
          :filters="filters"
        />
      </div>
    </div>
    <b-button
      v-if="synchSelected === typeMethodsSynch.SYNCH_FILTERED_PRODUCT"
      variant="outline-secondary"
      class="mt-3"
      @click="addNewFilter"
      :disabled="!filtersAreValid"
    >
      <i class="material-icons ps_gs-fz-20">add</i>
      {{ $t('productFeedSettings.productSelection.addFilter') }}
    </b-button>
    <b-alert
      v-if="false"
      class="mt-3"
      :variant="isErrorCountApi ? 'danger' : numberProductFiltered === 0 ? 'warning' : 'info'"
      show
    >
      <div v-if="isErrorCountApi">
        <span>{{ $t('productFeedSettings.productSelection.alerts.erreurCountApi') }}</span>
        <b-button
          size="sm"
          variant="danger"
          @click="loadCountProduct"
        >
          {{ $t('productFeedSettings.productSelection.alerts.tryAgain') }}
        </b-button>
      </div>
      <div v-else>
        <p>
          <span
            class="font-weight-600"
            v-if="numberProductFiltered > 0"
          >{{ numberProductFiltered }}</span> {{ $tc('productFeedSettings.productSelection.alerts.countProducts', numberProductFiltered) }}
        </p>
        <b-button
          size="sm"
          variant="info"
          @click="loadCountProduct"
        >
          {{ $t('productFeedSettings.productSelection.alerts.viewProducts') }}
        </b-button>
      </div>
    </b-alert>
    <actions-buttons
      :next-step="nextStep"
      :previous-step="previousStep"
      @cancelProductFeedSettingsConfiguration="cancel"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import LineFilter from '@/components/product-feed/settings/product-selection/line-filter.vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';
import FilterValidator from '@/components/product-feed/settings/product-selection/filterValidator';
import {
  ProductFilter,
  ProductFilterErrors,
  CleanProductFilter, type FeatureOption, type Feature,
} from '@/components/product-feed/settings/product-selection/type';
import ATTRIBUTE_MAP_CONDITION from '@/components/product-feed/settings/product-selection/attributeMapCondition';
import ProductFilterAttributes from '@/enums/product-feed/product-filter-attributes';
import ProductFilterMethodsSynch from '@/enums/product-feed/product-filter-methods-synch';
import ProductFilterValueType from '@/enums/product-feed/product-filter-value-type';
import ActionsTypes from '@/store/modules/product-feed/actions-types';
import MutationsTypes from '@/store/modules/product-feed/mutations-types';
import GetterTypes from '@/store/modules/product-feed/getters-types';

const newFilter = () => ({
  id: crypto.randomUUID(),
});

const localStorageName = 'productFeed-productFilter';

export default defineComponent({
  name: 'ProductFeedSettingsProductSelection',
  components: {
    ActionsButtons,
    LineFilter,
  },
  data() {
    return {
      typeMethodsSynch: ProductFilterMethodsSynch,
      synchSelected: getDataFromLocalStorage(localStorageName)
        ? ProductFilterMethodsSynch.SYNCH_FILTERED_PRODUCT
        : ProductFilterMethodsSynch.SYNCH_ALL_PRODUCT,
      listFilters: [] as ProductFilter[],
      filtersAreValid: false,
      numberProductFiltered: 1,
      isErrorCountApi: false,
    };
  },
  methods: {
    getFeatureByOptions(options: FeatureOption[]): Feature | undefined {
      function featureContainValues(feature: Feature, values: FeatureOption[]) {
        return values.every(
          (value: FeatureOption) => feature.values.some(
            (featureValue: FeatureOption) => featureValue.id === value.id,
          ),
        );
      }

      return this.features.find((feature: Feature) => featureContainValues(feature, options));
    },
    // used to create new filter for front with saved filter.
    recoverFilter(filter: CleanProductFilter): ProductFilter {
      const recoveredFilter = {
        ...newFilter(),
        ...filter,
      };

      if (recoveredFilter.attribute === ProductFilterAttributes.FEATURE
        && recoveredFilter.values?.length) {
        const feature = this.getFeatureByOptions(recoveredFilter.values);

        recoveredFilter.values = (recoveredFilter.values as FeatureOption[])
          .filter((el) => el.language === this.currentCountry);

        if (feature) {
          recoveredFilter.attribute = feature.id;
        }
      }

      return recoveredFilter;
    },

    convertStringBooleanToBoolean(value: any): any {
      if (typeof value !== 'string') {
        return value;
      }
      if (value.toLowerCase() === 'true') {
        return true;
      }
      if (value.toLowerCase() === 'false') {
        return false;
      }
      return value;
    },
    convertStringToNumber(value: any): any {
      if (!Number.isNaN(value) && !Number.isNaN(parseFloat(value))) {
        return Number(value);
      }
      return value;
    },
    // used to format filter before saving and sending it.
    cleanFilter(filter: ProductFilter): CleanProductFilter {
      const cleanFilter: CleanProductFilter = {
        attribute:
          filter.attribute === undefined
          || Object.keys(ATTRIBUTE_MAP_CONDITION).includes(filter.attribute as string)
            ? filter.attribute as string
            : ProductFilterAttributes.FEATURE,
        condition: filter.condition as string,
      };

      if (!cleanFilter.attribute || !cleanFilter.condition) {
        return cleanFilter;
      }

      if (ATTRIBUTE_MAP_CONDITION[cleanFilter.attribute][cleanFilter.condition].multiple) {
        switch (ATTRIBUTE_MAP_CONDITION[cleanFilter.attribute][cleanFilter.condition].type) {
          case ProductFilterValueType.BOOLEAN:
            cleanFilter.values = filter.values?.map(
              (value) => this.convertStringBooleanToBoolean(value),
            );
            break;
          case ProductFilterValueType.NUMBER:
            cleanFilter.values = filter.values?.map(
              (value) => this.convertStringToNumber(value),
            );
            break;
          default:
            cleanFilter.values = filter.values;
        }
      } else {
        switch (ATTRIBUTE_MAP_CONDITION[cleanFilter.attribute][cleanFilter.condition].type) {
          case ProductFilterValueType.BOOLEAN:
            cleanFilter.value = this.convertStringBooleanToBoolean(filter.value);
            break;
          case ProductFilterValueType.NUMBER:
            cleanFilter.value = this.convertStringToNumber(filter.value);
            break;
          default:
            cleanFilter.value = filter.value;
        }
      }

      // we have to add all location values options and not only the current;
      if (cleanFilter.attribute === ProductFilterAttributes.FEATURE) {
        const currentFeature = this.features
          .find((el) => Number(el.id) === Number(filter.attribute));

        if (currentFeature) {
          const featureOptions = currentFeature.values;
          const completeValues: FeatureOption[] = [];

          (filter.values as FeatureOption[])?.forEach((value) => {
            completeValues.push(...featureOptions.filter((el) => el.id === value.id));
          });

          cleanFilter.values = completeValues;
        }
      }

      return cleanFilter;
    },
    getCleanFilters() {
      return this.listFilters.map((filter) => this.cleanFilter(filter));
    },

    checkFiltersValidity(sendError: boolean) {
      let validity = true;

      this.listFilters.forEach((filter, index) => {
        const cleanFilter = this.cleanFilter(filter);
        const validator = new FilterValidator();
        validator.validate(cleanFilter);

        let errors: ProductFilterErrors = {
          attribute: undefined,
          condition: undefined,
          value: undefined,
          ...this.listFilters[index].errors,
        };

        if (!validator.isValid) {
          validity = false;
          if (sendError) {
            errors = {
              ...errors,
              ...validator.errors,
            };
          }
        }

        if (!sendError) {
          if (errors.attribute && !validator.errors.attribute) {
            delete errors.attribute;
          }
          if (errors.condition && !validator.errors.condition) {
            delete errors.condition;
          }
          if (errors.value && !validator.errors.value) {
            delete errors.value;
          }
        }

        this.$set(
          this.listFilters,
          index,
          {
            ...this.listFilters[index],
            errors,
          });
      });

      this.filtersAreValid = validity;
    },
    saveFilters() {
      const filters = this.getCleanFilters();
      localStorage.setItem(localStorageName, JSON.stringify(filters));
      this.$store.commit(`productFeed/${MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS}`, {
        name: 'productFilter', data: filters,
      });
    },
    deleteFilters() {
      localStorage.removeItem(localStorageName);
      this.$store.commit(`productFeed/${MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS}`, {
        name: 'productFilter', data: [],
      });
    },
    checkMethodSyncBeforeMoveStep() {
      if (this.synchSelected === ProductFilterMethodsSynch.SYNCH_ALL_PRODUCT) {
        this.deleteFilters();
      } else {
        this.saveFilters();
      }
    },
    previousStep() {
      this.$store.commit(`productFeed/${MutationsTypes.SET_ACTIVE_CONFIGURATION_STEP}`, 3);
      this.$router.push({
        params: {
          name: 'product-feed-settings',
          step: ProductFeedSettingsPages.ATTRIBUTE_MAPPING,
        },
      });
      window.scrollTo(0, 0);
    },
    nextStep() {
      if (this.synchSelected === ProductFilterMethodsSynch.SYNCH_FILTERED_PRODUCT) {
        this.checkFiltersValidity(true);
        if (!this.filtersAreValid) {
          return;
        }
      }

      this.checkMethodSyncBeforeMoveStep();
      this.$store.commit(`productFeed/${MutationsTypes.SET_ACTIVE_CONFIGURATION_STEP}`, 5);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.SYNC_SCHEDULE,
        },
      });
      window.scrollTo(0, 0);
    },
    addNewFilter() {
      this.listFilters.push(newFilter());
      this.checkFiltersValidity(false);
    },
    deleteFilter(index) {
      this.listFilters.splice(index, 1);
      this.checkFiltersValidity(false);
    },
    updateFilter(event, index) {
      this.$set(this.listFilters, index, {...this.listFilters[index], ...event});
      this.checkFiltersValidity(false);
    },
    loadCountProduct() {
      // TODO : cette methode doit appeler la requête qui permet de charger les produits filtré
      // Elle doit être appeler à plusieurs endroits :
      //    - quand le user finit de remplir les 3 champs dans un filtre
      //    - quand le user modifie un champs dans une filtre qui a déjà tous les champs de remplis
      //    - sur le bouton "Try angain" dans l'alerte qui s'affiche après l'échec de cette requête
      console.log('loadCountProduct');
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
  computed: {
    features(): Feature[] {
      return this.$store.getters[`productFeed/${GetterTypes.GET_PRODUCT_FILTER_FEATURES_OPTIONS}`];
    },
    currentCountry(): string {
      return window.i18nSettings.isoCode;
    },
  },
  async mounted() {
    // get all data for filters
    await this.$store.dispatch(`productFeed/${ActionsTypes.GET_SHOP_PRODUCT_FEATURES_OPTIONS}`);
    await this.$store.dispatch(`productFeed/${ActionsTypes.GET_SHOP_CATEGORIES_OPTIONS}`);
    await this.$store.dispatch(`productFeed/${ActionsTypes.GET_SHOP_BRANDS_OPTIONS}`);

    // get data from localstorage > store OR create new empty filter
    this.listFilters = getDataFromLocalStorage(localStorageName)
      ?.map((filter: CleanProductFilter) => this.recoverFilter(filter))
    || (this.$store.getters[`productFeed/${GetterTypes.GET_PRODUCT_FILTER}`]?.length
      ? this.$store.getters[`productFeed/${GetterTypes.GET_PRODUCT_FILTER}`]
        ?.map((filter: CleanProductFilter) => this.recoverFilter(filter))
      : [newFilter()]
    );
  },
});
</script>
