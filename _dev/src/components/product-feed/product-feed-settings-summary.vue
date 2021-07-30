<template>
  <div>
    <section>
      <h3 class="ps_gs-fz-16 font-weight-600 mb-3">
        {{ $t('productFeedSettings.summary.title1') }}
      </h3>
      <b-container
        fluid
        class="p-0 mb-4 mt-n1"
      >
        <b-row
          no-gutters
          class="mx-n1"
        >
          <product-feed-card-next-sync-card
            icon="store_mall_directory"
            :title="$t('productFeedSettings.summary.totalProducts')"
            :description="nextSyncTotalProducts"
          />
          <product-feed-card-next-sync-card
            icon="event"
            :title="$t('productFeedSettings.summary.date')"
            :description="nextSyncDate | timeConverterToDate"
          />
          <product-feed-card-next-sync-card
            icon="schedule"
            :title="$t('productFeedSettings.summary.time')"
            :description="nextSyncDate | timeConverterToHour"
          />
        </b-row>
      </b-container>
    </section>
    <section>
      <h3 class="ps_gs-fz-16 font-weight-600 mb-3">
        {{ $t('productFeedSettings.summary.title2') }}
      </h3>
      <b-container
        fluid
        class="p-0 mb-2"
      >
        <b-row
          no-gutters
          class="mx-n1"
        >
          <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.shipping.targetCountries')"
            :description="targetCountries.join(', ')"
            :link="$t('cta.editCountries')"
            :link-to="{type : 'stepper', name: 1}"
          />
          <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.shipping.shippingSettings')"
            :description="shippingSettings"
            :link="$t('cta.editSettings')"
            :link-to="{type : 'stepper', name: 1}"
          />
          <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.summary.dataSyncSetUp')"
            :description="'Sync daily at 2:00 AM'"
            :details="'(UTC+01:00) Normal time in Central Europe (Paris)'"
            size="full"
          />
          <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.summary.productAttributes')"
            :link="$t('cta.editProductAttributes')"
            :link-to="{type : 'stepper', name: 3}"
            size="full"
          >
            <b-table-simple
              stacked="md"
              class="mx-n1 mt-3 mb-0"
              borderless
              table-class="border-bottom-0 table-firstline-borderless ps_gs-table-attribute-mapping"
            >
              <b-thead>
                <b-tr>
                  <b-th class="border-0 font-weight-600 text-decoration-underline ps_gs-fz-12">
                    {{ $t('productFeedSettings.summary.tableHeader1') }}
                  </b-th>
                  <b-th class="border-0 font-weight-600 text-decoration-underline ps_gs-fz-12">
                    {{ $t('productFeedSettings.summary.tableHeader2') }}
                  </b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr>
                  <b-td class="pb-0 align-top pt-md-0 pb-md-1">
                    <span class="d-flex align-items-center">
                      {{ $t('productFeedSettings.attributeMapping.description') }}
                      <span
                        class="material-icons-round ml-auto ps_gs-fz-20
                          mr-md-2 mb-0 align-middle text-success"
                      >
                        link
                      </span>
                    </span>
                  </b-td>
                  <b-td class="pb-0 align-top pt-md-0 pb-md-1">
                    <b-form-group class="mb-0 text-left">
                      {{ $t('productFeedSettings.attributeMapping.longDescription') }}
                    </b-form-group>
                  </b-td>
                </b-tr>
                <template v-if="sellRefurbished">
                  <product-feed-settings-attribute-mapping-tablerow-specific
                    v-for="input in refurbishedInputs"
                    :key="input"
                    :input="input"
                    :is-report="true"
                  />
                </template>
                <template v-if="sellApparel">
                  <product-feed-settings-attribute-mapping-tablerow-specific
                    v-for="input in apparelInputs"
                    :key="input"
                    :input="input"
                    :is-report="true"
                  />
                </template>
              </b-tbody>
            </b-table-simple>
            <caption
              v-if="sellRefurbished || sellApparel"
              class="d-block ps_gs-fz-12 ps_gs-table-caption"
            >
              <VueShowdown
                :markdown="$t('productFeedSettings.summary.youSell', [specificProducts])"
              />
            </caption>
          </product-feed-card-report-card>
        </b-row>
      </b-container>
    </section>
    <div class="d-md-flex text-center justify-content-end mt-3 pt-2">
      <b-button
        @click="cancel"
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.cancel") }}
      </b-button>
      <b-button
        @click="saveAll"
        :disabled="disabledExportButton"
        size="sm"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t("cta.export") }}
      </b-button>
    </div>
    <product-feed-settings-footer
      :message="$t('freeListingCard.googleDelay')"
    />
    <VueShowdown
      :markdown="$t('productFeedSettings.export.prohibitedContentNotice',
                    [$options.googleUrl.prohibitedContentGuidelines])"
      :extensions="['targetlink']"
      class="text-muted ps_gs-fz-12 pt-2 mt-4 mb-n3"
    />
  </div>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';

import {BTableSimple} from 'bootstrap-vue';
import countriesSelectionOptions from '../../assets/json/countries.json';
import ProductFeedSettingsFooter from './product-feed-settings-footer';
import ProductFeedCardReportCard from './product-feed-card-report-card';
import ProductFeedSettingsAttributeMappingTablerowSpecific from './product-feed-settings-attribute-mapping-tablerow-specific';
import ProductFeedCardNextSyncCard from './product-feed-card-next-sync-card';

export default {
  name: 'ProductFeedSettingsSummary',
  components: {
    ProductFeedSettingsFooter,
    ProductFeedCardReportCard,
    ProductFeedSettingsAttributeMappingTablerowSpecific,
    ProductFeedCardNextSyncCard,
    BTableSimple,
  },
  data() {
    return {
      disabledExportButton: false,
      shippingSettings:
      this.$store.state.productFeed.settings.autoImportShippingSettings
        ? this.$t('productFeedSettings.shipping.automatically')
        : this.$t('productFeedSettings.shipping.manually'),
      refurbishedInputs: ['condition'],
      apparelInputs: ['color', 'size', 'ageGroup', 'gender'],
    };
  },
  computed: {
    sellApparel: {
      get() {
        return this.$store.getters['productFeed/GET_MERCHANT_SELL_APPAREL_AND_ACCESSORIES'];
      },
    },
    sellRefurbished: {
      get() {
        return this.$store.getters['productFeed/GET_MERCHANT_SELL_REFURBISHED_PRODUCTS'];
      },
    },
    nextSyncDate: {
      get() {
        return this.$store.state.productFeed.status.nextJobAt;
      },
    },
    nextSyncTotalProducts: {
      get() {
        return this.$store.getters['productFeed/GET_TOTAL_PRODUCTS'];
      },
    },
    specificProducts() {
      const tableOfSpecifics = [];
      if (this.sellRefurbished) {
        tableOfSpecifics.push(this.$t('productFeedSettings.attributeMapping.sellRefurbishedProducts'));
      }
      if (this.sellApparel) {
        tableOfSpecifics.push(this.$t('productFeedSettings.attributeMapping.sellApparelAndAccessories'));
      }
      return tableOfSpecifics;
    },
    targetCountries() {
      // change country code into name with the json list
      const datas = this.$store.getters['productFeed/GET_ACTIVE_COUNTRIES'];
      const country = this.$options.countriesSelectionOptions;
      return this.$options.filters.changeCountryCodeToName(datas, country);
    },
  },
  methods: {
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    saveAll() {
      this.disabledExportButton = true;
      if (this.$store.state.productFeed.settings.autoImportShippingSettings) {
        this.$store.dispatch('productFeed/GET_SHIPPING_SETTINGS')
          .then(() => {
            this.postDatas();
          });
      } else {
        this.postDatas();
      }
    },
    postDatas() {
      this.$store.dispatch('productFeed/SEND_PRODUCT_FEED_SETTINGS');
      this.$router.push({
        name: 'configuration',
      });
      this.disabledExportButton = false;
    },
  },
  countriesSelectionOptions,
  googleUrl,
};
</script>
