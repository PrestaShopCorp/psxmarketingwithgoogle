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
      @click="addNewFilter()"
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
      @cancelProductFeedSettingsConfiguration="cancel()"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import LineFilter from '@/components/product-feed/settings/product-selection/line-filter.vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';
import {
  ProductFilter,
  ProductFilterErrors,
  ProductFilterToSend,
} from '@/components/product-feed/settings/product-selection/type';
import ProductFilterMethodsSynch from '@/enums/product-feed/product-filter-methods-synch';
import {
  ProductFilterConditionApi,
  ProductFilterMultiSelectConditions,
  ProductFilterNumericArrayConditions,
  ProductFilterNumericConditions,
  ProductFilterStringConditions,
} from '@/enums/product-feed/product-filter-condition';
import ProductFilterDefaultAttributes from '@/enums/product-feed/product-filter-default-attributes';

function uuidv4() {
  // eslint-disable-next-line no-bitwise, no-mixed-operators
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16),
  );
}

const newFilter = () => ({
  id: uuidv4(),
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
    checkFiltersValidity(sendError: boolean) {
      let validity = true;

      if (this.synchSelected === ProductFilterMethodsSynch.SYNCH_FILTERED_PRODUCT) {
        this.listFilters.forEach((filter, index) => {
          const errors: ProductFilterErrors = {
            attribute: undefined,
            condition: undefined,
            value: undefined,
            ...this.listFilters[index].errors,
          };

          if (!filter.attribute) {
            if (sendError) {
              errors.attribute = this.$t('productFeedSettings.productSelection.lineFilter.errors.empty') as string;
            }
            validity = false;
          } else {
            errors.attribute = undefined;
          }

          if (filter.attribute !== 'outOfStock' && !filter.condition) {
            if (sendError) {
              errors.condition = this.$t('productFeedSettings.productSelection.lineFilter.errors.empty') as string;
            }
            validity = false;
          } else {
            errors.condition = undefined;
          }

          if (filter.conditionType === 'numeric' && filter.value === null) {
            if (sendError) {
              errors.value = this.$t('productFeedSettings.productSelection.lineFilter.errors.invalidNumber') as string;
            }
            validity = false;
          } else if (!(filter.value || filter.values?.length)) {
            if (sendError) {
              errors.value = this.$t('productFeedSettings.productSelection.lineFilter.errors.empty') as string;
            }
            validity = false;
          } else if (filter.conditionType === 'numericArray' && filter.values?.length && !filter.values?.every((value) => !Number.isNaN(Number(value)))) {
            if (sendError) {
              errors.value = 'il faut que les valeurs soient de type nombre' as string;
            }
            validity = false;
          } else {
            errors.value = undefined;
          }

          this.$set(
            this.listFilters,
            index,
            {
              ...this.listFilters[index],
              errors,
            });
        });
      }

      this.filtersAreValid = validity;
    },
    saveFilters() {
      localStorage.setItem(localStorageName, JSON.stringify(this.listFilters));
      this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
        name: 'productFilter', data: this.getCleanFilters(),
      });
    },
    deleteFilters() {
      localStorage.removeItem(localStorageName);
      this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
        name: 'productFilter', data: [],
      });
    },
    getCleanFilters() {
      return this.listFilters.map((filter) => {
        const cleanFilter: ProductFilterToSend = {
          attribute: filter.attribute ?? '',
        };

        if (filter.attribute === ProductFilterDefaultAttributes.OUT_OF_STOCK) {
          cleanFilter.condition = 'is';
        }

        if (filter.condition) {
          cleanFilter.condition = this.formatCondition(filter.condition);
        }

        if (filter.value) {
          cleanFilter.value = filter.value;
        } else if (filter.values?.length) {
          cleanFilter.values = filter.values;
        }

        return cleanFilter;
      });
    },
    formatCondition(condition) {
      const map = {
        [ProductFilterNumericConditions.IS_EQUAL_TO]: ProductFilterConditionApi.IS,
        [ProductFilterMultiSelectConditions.IS_IN]: ProductFilterConditionApi.IS,
        [ProductFilterNumericArrayConditions.IS_NOT_EQUAL_TO]: ProductFilterConditionApi.IS_NOT,
        [ProductFilterMultiSelectConditions.IS_NOT]: ProductFilterConditionApi.IS_NOT,
        [ProductFilterNumericConditions.IS_LESS_THAN]: ProductFilterConditionApi.LOWER,
        [ProductFilterNumericConditions.IS_GREATER_THAN]: ProductFilterConditionApi.GREATER,
        [ProductFilterStringConditions.CONTAINS]: ProductFilterConditionApi.CONTAINS,
        [ProductFilterStringConditions.NOT_CONTAIN]: ProductFilterConditionApi.DOES_NOT_CONTAIN,
      };

      return map[condition];
    },
    checkMethodSyncBeforeMoveStep() {
      if (this.synchSelected === ProductFilterMethodsSynch.SYNCH_ALL_PRODUCT) {
        this.deleteFilters();
      } else {
        this.saveFilters();
      }
    },
    previousStep() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 3);
      this.$router.push({
        params: {
          name: 'product-feed-settings',
          step: ProductFeedSettingsPages.ATTRIBUTE_MAPPING,
        },
      });
      window.scrollTo(0, 0);
    },
    nextStep() {
      this.checkFiltersValidity(true);
      if (!this.filtersAreValid) {
        return;
      }
      this.checkMethodSyncBeforeMoveStep();
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 5);
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
  mounted() {
    this.listFilters = getDataFromLocalStorage(localStorageName)
    || (this.$store.getters['productFeed/GET_PRODUCT_FILTER']?.length
      ? this.$store.getters['productFeed/GET_PRODUCT_FILTER'].map((filter: ProductFilterToSend) => ({...filter, ...newFilter()}))
      : [newFilter()]
    );
  },
});
</script>
