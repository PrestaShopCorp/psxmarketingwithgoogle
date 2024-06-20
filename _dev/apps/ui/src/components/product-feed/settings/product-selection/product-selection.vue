<!-- eslint-disable max-len -->
<template>
  <div class="gs-product-selection">
    <h3 class="font-weight-600">
      {{ $t('productFeedSettings.productSelection.methodSynch.title') }}
    </h3>
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <div class="container-fluid">
          <div class="row methods-sync ps_gs-radio">
            <b-skeleton
              height="5rem"
              class="col col-12 col-md p-3 rounded-0"
            />
            <b-skeleton
              height="5rem"
              class="col col-12 col-md p-3 ml-md-1 mt-1 mt-md-0 rounded-0"
            />
          </div>
        </div>
        <div class="filters">
          <b-skeleton
            height="7rem"
            class="rounded-0"
          />
        </div>
      </template>
      <div class="container-fluid">
        <div class="row methods-sync ps_gs-radio">
          <div
            class="col col-12 col-md border-primary-400 p-3"
            :class="{'checked': synchSelected === typeMethodsSynch.SYNCH_ALL_PRODUCT}"
          >
            <b-form-radio
              v-model="synchSelected"
              name="customSyncRadio"
              :value="typeMethodsSynch.SYNCH_ALL_PRODUCT"
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
                :value="typeMethodsSynch.SYNCH_FILTERED_PRODUCT"
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
            <span class="font-weight-500">{{ $t('productFeedSettings.productSelection.and') }}</span>
            <hr>
          </div>
          <line-filter
            :delete-button-disabled="listFilters.length === 1"
            @clickToDeleteFilter="deleteFilter(index)"
            @dataUpdated="updateFilter($event, index)"
            :filters="filters"
            :filter-index="index"
          />
        </div>
      </div>
      <b-button
        v-if="synchSelected === typeMethodsSynch.SYNCH_FILTERED_PRODUCT"
        variant="outline-secondary"
        class="mt-3"
        id="add-filter"
        @click="addNewFilter"
        :disabled="!filtersAreValid"
      >
        <i class="material-icons ps_gs-fz-20">add</i>
        {{ $t('productFeedSettings.productSelection.addFilter') }}
      </b-button>
      <ProductCount
        v-if="displayProductCount && !loading"
      />
    </b-skeleton-wrapper>
    <actions-buttons
      :next-step="nextStep"
      :previous-step="previousStep"
      :disable-continue="disableNextStep"
      @cancelProductFeedSettingsConfiguration="cancel"
    />
    <settings-footer />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import LineFilter from '@/components/product-feed/settings/product-selection/line-filter.vue';
import ProductCount from '@/components/product-feed/settings/product-selection/product-count.vue';
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
import {booleanToString, stringToBoolean} from '@/utils/StringToBoolean';
import stringToNumber from '@/utils/StringToNumber';
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {newFilter, localStorageProductFilter, localStorageProductFilterSync} from '@/components/product-feed/settings/product-selection/product-selection-utilities';

export default defineComponent({
  name: 'ProductFeedSettingsProductSelection',
  components: {
    SettingsFooter,
    ActionsButtons,
    LineFilter,
    ProductCount,
  },
  data() {
    return {
      typeMethodsSynch: ProductFilterMethodsSynch,
      listFilters: [] as ProductFilter[],
      filtersAreValid: false,
      loading: true,
    };
  },
  methods: {
    getFeatureByOptions(options: FeatureOption[]): Feature | undefined {
      function featureContainValues(feature: Feature, values: FeatureOption[]) {
        return values.some(
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
        && recoveredFilter.value?.length) {
        const feature = this.getFeatureByOptions(recoveredFilter.value);

        // we need to update recovered value with new from BO if exist
        // because it can break if we got new language introduced.
        const valueIdToMatch = new Set((recoveredFilter.value as FeatureOption[])
          .map((item) => item.id));
        const featureOptions = feature.values.filter((item) => valueIdToMatch.has(item.id));

        recoveredFilter.value = (featureOptions as FeatureOption[])
          .filter((el) => el.language === this.currentCountry);

        if (feature) {
          recoveredFilter.attribute = feature.id;
        }
      }

      if (recoveredFilter.attribute === ProductFilterAttributes.OUT_OF_STOCK
        && recoveredFilter.value !== undefined) {
        recoveredFilter.value = booleanToString(recoveredFilter.value);
      }

      return recoveredFilter;
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

      const multipleValue = ATTRIBUTE_MAP_CONDITION[cleanFilter.attribute][cleanFilter.condition]
        .multiple;

      switch (ATTRIBUTE_MAP_CONDITION[cleanFilter.attribute][cleanFilter.condition].type) {
        case ProductFilterValueType.BOOLEAN:
          cleanFilter.value = multipleValue ? filter.value?.map(
            (value) => stringToBoolean(value),
          ) : stringToBoolean(filter.value);
          break;
        case ProductFilterValueType.NUMBER:
          cleanFilter.value = multipleValue ? filter.value?.map(
            (value) => stringToNumber(value),
          ) : stringToNumber(filter.value);
          break;
        default:
          cleanFilter.value = filter.value;
      }

      // we have to add all location values options and not only the current;
      if (cleanFilter.attribute === ProductFilterAttributes.FEATURE) {
        const currentFeature = this.features
          .find((el) => Number(el.id) === Number(filter.attribute));

        if (currentFeature) {
          const featureOptions = currentFeature.values;
          const completeValues: FeatureOption[] = [];

          (filter.value as FeatureOption[])?.forEach((value) => {
            completeValues.push(...featureOptions.filter((el) => el.id === value.id));
          });

          cleanFilter.value = completeValues;
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
    saveFilters(localStorageSave = false) {
      const filters = this.getCleanFilters();

      if (localStorageSave) {
        localStorage.setItem(localStorageProductFilter, JSON.stringify(filters));
      }
      this.$store.commit(`productFeed/${MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS}`, {
        name: 'productFilter', data: filters,
      });
    },
    deleteFilters() {
      localStorage.removeItem(localStorageProductFilter);
      this.$store.commit(`productFeed/${MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS}`, {
        name: 'productFilter', data: [],
      });
    },
    checkMethodSyncBeforeMoveStep() {
      if (this.synchSelected === ProductFilterMethodsSynch.SYNCH_ALL_PRODUCT) {
        this.deleteFilters();
      } else {
        this.saveFilters(true);
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

      localStorage.setItem(localStorageProductFilterSync, this.synchSelected);
      this.$segment.track('[GGL] Product feed config - Step 4 Product selection', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.$store.commit(`productFeed/${MutationsTypes.SET_ACTIVE_CONFIGURATION_STEP}`, 4);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.SUMMARY,
        },
      });
      window.scrollTo(0, 0);
    },
    saveFiltersInStoreAndUpdateCount() {
      if (this.filtersAreValid) {
        this.saveFilters();
        this.$store.dispatch(`productFeed/${ActionsTypes.TRIGGER_PRODUCT_COUNT}`);
      }
    },
    addNewFilter() {
      this.listFilters.push(newFilter());
      this.checkFiltersValidity(false);
    },
    deleteFilter(index) {
      this.listFilters.splice(index, 1);
      this.checkFiltersValidity(false);
      this.saveFiltersInStoreAndUpdateCount();
    },
    updateFilter(event, index) {
      this.$set(this.listFilters, index, {...this.listFilters[index], ...event});
      this.checkFiltersValidity(false);
      this.saveFiltersInStoreAndUpdateCount();
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
  computed: {
    ...mapGetters({
      productCountStatus: `productFeed/${GetterTypes.GET_PRODUCT_COUNT_STATUS}`,
    }),
    synchSelected: {
      get(): ProductFilterMethodsSynch {
        return this.$store.getters[`productFeed/${GetterTypes.GET_METHOD_SYNC}`];
      },
      set(value: ProductFilterMethodsSynch): void {
        this.$store.commit(`productFeed/${MutationsTypes.SET_SYNC_METHOD}`, value);
        if (value === ProductFilterMethodsSynch.SYNCH_FILTERED_PRODUCT
          && (!this.listFilters.length || !this.filtersAreValid)) {
          return;
        }
        this.$store.dispatch(`productFeed/${ActionsTypes.TRIGGER_PRODUCT_COUNT}`);
      },
    },
    displayProductCount(): boolean {
      return this.productCountStatus
        && (this.synchSelected === ProductFilterMethodsSynch.SYNCH_ALL_PRODUCT
        || (this.listFilters.length > 0 && this.filtersAreValid));
    },
    features(): Feature[] {
      return this.$store.getters[`productFeed/${GetterTypes.GET_PRODUCT_FILTER_FEATURES_OPTIONS}`];
    },
    currentCountry(): string {
      return window.i18nSettings.isoCode;
    },
    disableNextStep(): boolean {
      return this.loading;
    },
  },
  async mounted() {
    this.loading = true;
    // get all data for filters
    await this.$store.dispatch(`productFeed/${ActionsTypes.GET_SHOPS_PRODUCTS_INFOS}`);
    await this.$store.dispatch(`productFeed/${ActionsTypes.GET_PRODUCT_FILTER_SETTINGS}`);

    const currentSync = localStorage
      .getItem(localStorageProductFilterSync) as ProductFilterMethodsSynch;
    const localStorageFilters = getDataFromLocalStorage(localStorageProductFilter);
    const storeApiFilters = this.$store.getters[`productFeed/${GetterTypes.GET_PRODUCT_FILTER}`];
    const localFilters = localStorageFilters
      || storeApiFilters;

    if (currentSync) {
      this.synchSelected = currentSync;
    } else if (storeApiFilters?.length) {
      this.synchSelected = ProductFilterMethodsSynch.SYNCH_FILTERED_PRODUCT;
    }

    if (this.synchSelected === ProductFilterMethodsSynch.SYNCH_FILTERED_PRODUCT
      && localFilters?.length) {
      this.listFilters = localFilters
        .map((filter: CleanProductFilter) => this.recoverFilter(filter));
      this.checkFiltersValidity(true);
    } else {
      this.listFilters = [newFilter()];
    }

    if (this.synchSelected === ProductFilterMethodsSynch.SYNCH_ALL_PRODUCT
      || this.filtersAreValid) {
      await this.$store.dispatch(`productFeed/${ActionsTypes.TRIGGER_PRODUCT_COUNT}`);
    }

    this.loading = false;
  },
});
</script>
