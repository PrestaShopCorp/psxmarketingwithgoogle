<template>
  <div class="gs-product-selection">
    <h3 class="font-weight-600">
      {{ $t('productFeedSettings.productSelection.methodSync.title') }}
    </h3>
    <div class="container-fluid">
      <div class="row methods-sync">
        <div
          class="col col-12 col-md border-primary-400 p-3"
          :class="{'border-primary-800': syncSelected === 'syncAllProducts'}"
        >
          <b-form-radio
            v-model="syncSelected"
            name="customSyncRadio"
            value="syncAllProducts"
          >
            <h3 class="font-weight-700 mb-2 ps_gs-fz-14">
              {{ $t('productFeedSettings.productSelection.methodSync.syncAllProducts') }}
            </h3>
            <span class="text-muted">
              {{ $t('productFeedSettings.productSelection.methodSync.syncAllProductsDesc') }}
            </span>
          </b-form-radio>
        </div>
        <div
          class="col col-12 col-md border-primary-400 p-3 ml-md-1 mt-1 mt-md-0"
          :class="{'border-primary-800': syncSelected === 'syncFilteredProducts'}"
        >
          <div>
            <b-form-radio
              v-model="syncSelected"
              name="customSyncRadio"
              value="syncFilteredProducts"
            >
              <h3 class="font-weight-700 mb-2 ps_gs-fz-14">
                {{ $t('productFeedSettings.productSelection.methodSync.syncFilteredProducts') }}
              </h3>
              <span class="text-muted">
                {{
                  $t('productFeedSettings.productSelection.methodSync.syncFilteredProductsDesc')
                }}
              </span>
            </b-form-radio>
          </div>
        </div>
      </div>
    </div>
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
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import ProductFilterMethodsSync from '@/enums/product-feed/product-filter-mothods-sync';

export default defineComponent({
  name: 'ProductFeedSettingsProductSelection',
  components: {
    ActionsButtons,
  },
  data() {
    return {
      syncSelected: ProductFilterMethodsSync.SYNC_ALL_PRODUCT,
    };
  },
  methods: {
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
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 5);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.SYNC_SCHEDULE,
        },
      });
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
});
</script>
