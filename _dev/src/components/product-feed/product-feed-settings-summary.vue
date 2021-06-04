<template>
  <div>
    <section>
      <h3 class="ps_gs-fz-16 font-weight-600 mb-3">
        Next synchronisation
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
            title="Total products"
            description="210"
          />
          <product-feed-card-next-sync-card
            icon="event"
            title="Date"
            description="06/12/21"
          />
          <product-feed-card-next-sync-card
            icon="schedule"
            title="Time"
            description="2:00 AM"
          />
        </b-row>
      </b-container>
    </section>
    <section>
      <h3 class="ps_gs-fz-16 font-weight-600 mb-3">
        Product feed settings summary
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
            link-to="#"
          />
          <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.shipping.shippingSettings')"
            :description="shippingSettings"
            :link="$t('cta.editSettings')"
            link-to="#"
          />
          <product-feed-card-report-card
            status="success"
            :title="'Sync schedule'"
            :description="'Sync daily at 2:00 AM'"
            :details="'(UTC+01:00) Normal time in Central Europe (Paris)'"
            size="full"
          />
          <product-feed-card-report-card
            status="success"
            :title="'Mapped attributes'"
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
                    Google Merchant Center
                  </b-th>
                  <b-th class="border-0 font-weight-600 text-decoration-underline ps_gs-fz-12">
                    PrestaShop
                  </b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr>
                  <b-td class="pb-0 align-top pt-md-0 pb-md-1">
                    <span class="d-flex align-items-center">
                      Product items
                      <span
                        class="material-icons-round ml-auto ps_gs-fz-20 mr-md-2 mb-0 align-middle text-success"
                      >
                        link
                      </span>
                    </span>
                  </b-td>
                  <b-td class="pb-0 align-top pt-md-0 pb-md-1">
                    <b-form-group class="mb-0 text-left">
                      Long description
                    </b-form-group>
                  </b-td>
                </b-tr>
                <template v-if="sellRefurbished">
                  <product-feed-settings-attribute-mapping-tablerow-specific
                    v-for="input in refurbishedInputs"
                    :key="input"
                    :input="input"
                    :isReport="true"
                  />
                </template>
                <template v-if="sellApparel">
                  <product-feed-settings-attribute-mapping-tablerow-specific
                    v-for="input in apparelInputs"
                    :key="input"
                    :input="input"
                    :isReport="true"
                  />
                </template>
              </b-tbody>
            </b-table-simple>
            <caption
              v-if="sellRefurbished || sellApparel"
              class="d-block ps_gs-fz-12"
            >
              <span class="text-dark">
                You sell
              </span>
              <span class="text-muted">
                {{ specificProducts }}
              </span>
            </caption>
          </product-feed-card-report-card>
        </b-row>
      </b-container>
    </section>
    <div class="d-md-flex text-center justify-content-end mt-3 pt-2">
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.back") }}
      </b-button>
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.cancel") }}
      </b-button>
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t("cta.saveAndExport") }}
      </b-button>
    </div>
    <product-feed-settings-footer
      :message="$t('freeListingCard.googleDelay')"
    />
  </div>
</template>

<script>
import { BTableSimple } from 'bootstrap-vue';

import ProductFeedSettingsFooter from './product-feed-settings-footer';
import ProductFeedCardReportCard from './product-feed-card-report-card';
import ProductFeedCardReportMappedCategoriesCard from './product-feed-card-report-mapped-categories-card';
import ProductFeedCardReportProductsCard from './product-feed-card-report-products-card';
import ProductFeedSettingsAttributeMappingTablerowSpecific from './product-feed-settings-attribute-mapping-tablerow-specific';
import ProductFeedCardNextSyncCard from './product-feed-card-next-sync-card';

export default {
  name: 'ProductFeedSettingsSummary',
  components: {
    ProductFeedSettingsFooter,
    ProductFeedCardReportCard,
    ProductFeedCardReportMappedCategoriesCard,
    ProductFeedCardReportProductsCard,
    ProductFeedSettingsAttributeMappingTablerowSpecific,
    ProductFeedCardNextSyncCard,
    BTableSimple,
  },
  data() {
    return {
      enabledProductFeed: true,
      nextSyncTime: '06/12/21 02:00',
      lastSync: {
        day: 'today',
        time: '02:00',
        totalProducts: 200,
      },
      targetCountries: ['France', 'United States'],
      shippingSettings: 'Automatic',
      refurbishedInputs: ['condition'],
      apparelInputs: ['color', 'size', 'ageGroup', 'gender'],
      sellRefurbished: true,
      sellApparel: true,
    };
  },
  computed: {
    specificProducts() {
      let tableOfSpecifics = [];
      if (this.sellRefurbished) tableOfSpecifics.push('refurbished');
      if (this.sellApparel) tableOfSpecifics.push('apparel and accessories')
      return tableOfSpecifics.join(', ');
    },
  },
};
</script>
