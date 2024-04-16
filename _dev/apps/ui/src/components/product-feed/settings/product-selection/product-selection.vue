<!-- eslint-disable max-len -->
<template>
  <div class="gs-product-selection">
    <h3 class="font-weight-600">
      {{ $t('productFeedSettings.productSelection.methodSynch.title') }}
    </h3>
    <div class="container-fluid">
      <div class="row methods-synch">
        <div
          class="col col-12 col-md border-primary-400 p-3"
          :class="{'border-primary-800': synchSelected === 'synchAllProducts'}"
        >
          <b-form-radio
            v-model="synchSelected"
            name="customSynchRadio"
            value="synchAllProducts"
          >
            <h3 class="font-weight-700 mb-2">
              {{ $t('productFeedSettings.productSelection.methodSynch.synchAllProducts') }}
            </h3>
            <span class="text-primary-600">
              {{ $t('productFeedSettings.productSelection.methodSynch.synchAllProductsDesc') }}
            </span>
          </b-form-radio>
        </div>
        <div
          class="col col-12 col-md border-primary-400 p-3 ml-md-1 mt-1 mt-md-0"
          :class="{'border-primary-800': synchSelected === 'synchFilteredProducts'}"
        >
          <div>
            <b-form-radio
              v-model="synchSelected"
              name="customSynchRadio"
              value="synchFilteredProducts"
            >
              <h3 class="font-weight-700 mb-2">
                {{ $t('productFeedSettings.productSelection.methodSynch.synchFilteredProducts') }}
              </h3>
              <span class="text-primary-600">
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
      v-if="synchSelected === 'synchFilteredProducts'"
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
      variant="outline-secondary"
      class="mt-3"
      @click="addNewFilter()"
    >
      <i class="material-icons ps_gs-fz-20">add</i>
      {{ $t('productFeedSettings.productSelection.addFilter') }}
    </b-button>
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

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

const newFilter = () => {
  return {
    id: uuidv4()
  }
}

export default defineComponent({
  name: 'ProductFeedSettingsProductSelection',
  components: {
    ActionsButtons,
    LineFilter,
  },
  data() {
    return {
      synchSelected: 'synchFilteredProducts',
      listFilters: [newFilter()],
    };
  },
  computed: {
    filtersToConfigure() {
      return this.listFilters
        || getDataFromLocalStorage('productFeed-productFilter')
        || (this.$store.getters['productFeed/GET_PRODUCT_FILTER']?.length
          ? this.$store.getters['productFeed/GET_PRODUCT_FILTER']
          : null
        );
    },
  },
  methods: {
    saveSelectedProducts() {
      localStorage.setItem('productFeed-targetCountries', JSON.stringify(this.listFilters));
      this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
        name: 'productFilter', data: this.listFilters,
      });
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
      this.saveSelectedProducts();
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
    },
    deleteFilter(index) {
      this.listFilters.splice(index, 1);
    },
    updateFilter(event, index) {
      console.log('event: ', event);
      console.log('before: ', JSON.stringify(this.listFilters[index]));
      this.listFilters[index] = {...this.listFilters[index], ...event};
      console.log('after: ',this.listFilters[index]);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
});
</script>
