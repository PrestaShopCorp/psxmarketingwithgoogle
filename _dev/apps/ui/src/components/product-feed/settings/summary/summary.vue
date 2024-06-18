<template>
  <div>
    <section>
      <b-container
        fluid
        class="p-0 mb-4 mt-n1"
      >
        <b-alert
          class="alert--bordered"
          variant="info"
          show
        >
          {{ $t('productFeedSettings.summary.nextSync', { date: formatNextSyncDate }) }}
        </b-alert>
      </b-container>
    </section>
    <section>
      <h3 class="ps_gs-fz-16 font-weight-600 mb-3">
        {{ $t('productFeedSettings.summary.title') }}
      </h3>
      <b-container
        fluid
        class="p-0 mb-4"
      >
        <div class="product-feed-summary-card-container">
          <div class="product-feed-summary-card-column">
            <product-feed-summary-card
              :link-to="{ name: 'product-feed-settings',
                          step: 4, params: ProductFeedSettingsPages.PRODUCT_SELECTION }"
            >
              <template #title>
                {{ $t('productFeedSettings.summaryTitles.selectedProducts') }}
              </template>
              <template>
                <b-skeleton-wrapper :loading="productFilterStatus === ProductFeedCountStatus.PENDING">
                  <template #loading>
                    <b-skeleton
                      height="1.25rem"
                      width="50%"
                    />
                  </template>
                  <div v-if="productFilterStatus === ProductFeedCountStatus.SUCCESS">
                    {{ productCountToDisplay }}
                  </div>
                  <b-alert
                    v-if="productFilterStatus === ProductFeedCountStatus.ERROR"
                    variant="warning"
                    show
                  >
                    <div>
                      <p class="d-flex align-items-center">
                        {{ $t('productFeedSettings.summary.errorLoadDataSelectedProduct') }}
                      </p>
                      <b-btn
                        @click="requestProductCount"
                        variant="warning"
                      >
                        {{ $t('productFeedSettings.productSelection.productCount.tryAgain') }}
                      </b-btn>
                    </div>
                  </b-alert>
                </b-skeleton-wrapper>
              </template>
            </product-feed-summary-card>
            <product-feed-summary-card
              v-if="isUS"
              :link-to="{ name: 'product-feed-settings',
                          step: 2, params: ProductFeedSettingsPages.SHIPPING_SETTINGS }"
            >
              <template #title>
                {{ $t('productFeedSettings.summaryTitles.taxSettings') }}
              </template>
              <template>
                {{ taxSettings }}
              </template>
            </product-feed-summary-card>
            <product-feed-summary-card
              :link-to="{ name: 'product-feed-settings',
                          step: 1, params: ProductFeedSettingsPages.SHIPPING_SETUP }"
            >
              <template #title>
                {{ $t('productFeedSettings.summaryTitles.shippingParameters') }}
              </template>
              <template>
                {{ shippingSetupDescription }}
              </template>
            </product-feed-summary-card>
            <product-feed-summary-card>
              <template #title>
                {{ $t('productFeedSettings.summaryTitles.dataSyncConfiguration') }}
              </template>
              <template>
                {{ getSyncSchedule }}
              </template>
            </product-feed-summary-card>
            <product-feed-summary-card
              :link-to="{ name: 'product-feed-settings',
                          step: 2, params: ProductFeedSettingsPages.SHIPPING_SETTINGS }"
            >
              <template #title>
                {{ $t('productFeedSettings.summaryTitles.deliveryTimesAndRates') }}
              </template>
              <template>
                <p>
                  {{ $tc(
                    'productFeedSettings.deliveryTimeAndRates.targetCountries',
                    targetCountries.length,
                  ) }}: {{ targetCountries.join(', ') }}
                </p>
                <span>{{ deliveryTimeAndRatesDescription }}</span>
              </template>
            </product-feed-summary-card>
          </div>
          <div class="product-feed-summary-card-column">
            <product-feed-summary-card
              :link-to="{ name: 'product-feed-settings',
                          step: 3, params: ProductFeedSettingsPages.ATTRIBUTE_MAPPING}"
            >
              <template #title>
                {{ $t('productFeedSettings.summaryTitles.attributesMapping') }}
              </template>
              <template>
                <VueShowdown
                  v-if="getNumberOfAttributesMapped"
                  :markdown="
                    $tc(
                      'productFeedSettings.summary.attributeMapped',
                      getNumberOfAttributesMapped,
                      [getNumberOfAttributesMapped]
                    )
                  "
                  :extensions="['no-p-tag']"
                />
                <div class="gs-table-attribute-mapping">
                  <b-table-simple
                    borderless
                    table-class="gs-table-attribute-mapping--table"
                  >
                    <b-thead>
                      <b-tr>
                        <b-th class="gs-table-attribute-mapping--column">
                          <p class="gs-table-attribute-mapping--column-title">
                            {{ $t('productFeedSettings.summary.tableHeader1') }}
                          </p>
                        </b-th>
                        <b-th class="gs-table-attribute-mapping--column">
                          <p class="gs-table-attribute-mapping--column-title">
                            {{ $t("productFeedSettings.summary.tableHeader2") }}
                          </p>
                        </b-th>
                      </b-tr>
                    </b-thead>
                    <b-tbody>
                      <TableRowMapping
                        v-for="attribute in getMapping"
                        :key="attribute.google"
                        :attribute="attribute"
                      />
                    </b-tbody>
                  </b-table-simple>
                </div>
              </template>
            </product-feed-summary-card>
          </div>
        </div>
      </b-container>
      <b-form-group
        :label="$t('productFeedSettings.summary.agreementTitle')"
        label-class="h3 font-weight-700 mb-1 d-block p-0 bg-transparent border-0"
      >
        <ul>
          <li>{{ $t('productFeedSettings.summary.agreement1') }}</li>
          <li>{{ $t('productFeedSettings.summary.agreement2') }}</li>
        </ul>
        <b-form-checkbox
          data-test-id="buttonCheckbox"
          class="ps_gs-checkbox mt-n1"
          v-model="understandTerms"
        >
          <VueShowdown
            :markdown="
              $t('productFeedSettings.summary.agreementCheckboxLabel')
            "
          />
        </b-form-checkbox>
      </b-form-group>
    </section>
    <actions-buttons
      :next-step="saveAll"
      :previous-step="previousStep"
      :disable-continue="disabledExportButton"
      :disable-tooltip="$t('productFeedSettings.summary.disabledButtonTooltip')"
      :ok-label="$t('cta.saveAndExport')"
      @cancelProductFeedSettingsConfiguration="cancel()"
    />
    <settings-footer :message="$t('freeListingCard.googleDelay')" />
    <VueShowdown
      :markdown="
        $t('productFeedSettings.export.prohibitedContentNotice', [
          $options.googleUrl.prohibitedContentGuidelines,
        ])
      "
      :extensions="['extended-link']"
      class="text-muted ps_gs-fz-12 pt-2 mt-4 mb-n3"
    />
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {BTableSimple} from 'bootstrap-vue';
import {VueShowdown} from 'vue-showdown';
import {defineComponent} from 'vue';
import {mapActions, mapGetters} from 'vuex';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import googleUrl from '@/assets/json/googleUrl.json';
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import TableRowMapping from '@/components/product-feed/summary/table-row-mapping.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';
import productFeedSummaryCard from '@/components/product-feed/summary/product-feed-summary-card.vue';
import ProductFeedMixin from '@/components/mixins/Product-Feed-Mixin';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import ActionsTypes from '@/store/modules/product-feed/actions-types';
import GetterTypes from '@/store/modules/product-feed/getters-types';
import ProductFeedCountStatus from '@/enums/product-feed/product-feed-count-status';

dayjs.extend(duration);

export default defineComponent({
  name: 'ProductFeedSettingsSummary',
  components: {
    SettingsFooter,
    ActionsButtons,
    BTableSimple,
    VueShowdown,
    TableRowMapping,
    productFeedSummaryCard,
  },
  mixins: [ProductFeedMixin],
  data() {
    return {
      ProductFeedSettingsPages,
      understandTerms: false,
      ProductFeedCountStatus,
    };
  },
  computed: {
    ...mapGetters({
      productCount: `productFeed/${GetterTypes.GET_PRODUCT_COUNT}`,
      productFilterStatus: `productFeed/${GetterTypes.GET_PRODUCT_COUNT_STATUS}`,
      nextSyncTotalProducts: `productFeed/${GetterTypes.GET_TOTAL_PRODUCTS_READY_TO_SYNC}`,
    }),
    disabledExportButton() {
      return !this.understandTerms;
    },
    nextSyncInHours() {
      // Return how many hours left before next sync
      const now = dayjs();
      const nextSync = dayjs(this.nextSyncDate);

      return dayjs.duration(nextSync.diff(now)).hours();
    },
    nextSyncDate() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS']
        .nextJobAt;
    },
    formatNextSyncDate() {
      return this.$options.filters.timeConverterToStringifiedDate(
        this.nextSyncDate,
      );
    },
    selectedProductCategories() {
      return getDataFromLocalStorage('productFeed-selectedProductCategories') || this.$store.getters['productFeed/GET_PRODUCT_CATEGORIES_SELECTED'];
    },
    mandatoryAttributesNotMapped() {
      let getNumberAttrNotMapped = 0;

      this.getMapping.forEach((el) => {
        if (el.prestashop === '') {
          getNumberAttrNotMapped += 1;
        }
      });

      return getNumberAttrNotMapped;
    },
    getNumberOfAttributesMapped() {
      let mapped = 0;

      this.getMapping.forEach((el) => {
        if (el.prestashop !== '') {
          mapped += 1;
        }
      });

      return mapped;
    },
    getMapping() {
      return (getDataFromLocalStorage('productFeed-attributeMapping')
        || this.$store.getters[
          'productFeed/GET_FREE_LISTING_ATTRIBUTES_TO_MAP'
        ])
        .filter(
          (item) => this.selectedProductCategories.includes(item.category)
            || item.category === 'commons',
        )
        .map((attr) => attr.fields)
        .flat(1)
        .map((attribute) => ({
          ...attribute,
          recommended: attribute.recommended
            .map((recommended) => recommended.name)
            .join(', '),
          mapped: attribute.mapped?.map((mapped) => mapped.name).join(', '),
        }))
        .map((final) => ({
          google: final.name,
          prestashop:
            final.mapped !== undefined ? final.mapped : final.recommended,
        }));
    },
    deliveryTimeAndRatesDescription() {
      if (this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']) {
        return '--';
      }

      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.IMPORT
        // Backward compatibility
        || this.getProductFeedSettings.autoImportShippingSettings
      ) {
        return this.$t('productFeedSettings.deliveryTimeAndRates.importOption.summary');
      }
      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.ESTIMATE) {
        if (this.targetCountries.length === 1) {
          return this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.summary.singleCountry');
        }
        return this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.summary.multiCountriesFlatRateForAll');
      }

      return this.$t('productFeedCard.missingInformation');
    },
    getSyncSchedule() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'].syncSchedule;
    },
    shippingSetupDescription() {
      if (this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']) {
        return this.$t('productFeedSettings.shippingSetup.laterOption.summary');
      }

      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.IMPORT
        // Backward compatibility
        || this.getProductFeedSettings.autoImportShippingSettings
      ) {
        return this.$t('productFeedSettings.shippingSetup.importOption.summary');
      }
      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.ESTIMATE) {
        return this.$t('productFeedSettings.shippingSetup.estimateOption.summary');
      }

      return this.$t('productFeedCard.missingInformation');
    },
    productCountToDisplay() {
      if (this.productCount < 1) {
        return '--';
      }
      return this.productCount;
    },
    taxSettings() {
      if (this.getProductFeedSettings.autoImportTaxSettings === undefined) {
        return this.$t('productFeedCard.missingInformation');
      }
      return this.getProductFeedSettings.autoImportTaxSettings
        ? this.$t('productFeedSettings.deliveryTimeAndRates.automatically')
        : this.$t('productFeedSettings.deliveryTimeAndRates.manually');
    },
  },
  methods: {
    ...mapActions({
      requestAttributeMapping: `productFeed/${ActionsTypes.REQUEST_ATTRIBUTE_MAPPING}`,
      requestProductCount: `productFeed/${ActionsTypes.TRIGGER_PRODUCT_COUNT}`,
    }),
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    saveAll() {
      this.$segment.track('[GGL] Product feed config - Export catalog', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.$emit('save');
    },
    previousStep() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 4);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.PRODUCT_SELECTION,
        },
      });
      window.scrollTo(0, 0);
    },
  },
  mounted() {
    this.requestAttributeMapping();
    this.requestProductCount();
  },

  googleUrl,
});
</script>
