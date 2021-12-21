<template>
  <div>
    <section>
      <h3 class="ps_gs-fz-16 font-weight-600 mb-3">
        {{ $t('productFeedSettings.summary.title1', [nextSyncInHours]) }}
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
            class="ps_gs-productfeed-report-card--66"
            icon="event"
            :title="$t('productFeedSettings.summary.date')"
            :description="selectedSyncScheduleIsDefault ?
              (nextSyncDate | timeConverterToStringifiedDate)
              : $t('productFeedSettings.summary.syncScheduledNow')"
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
        class="p-0 mb-3"
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
            :description="$t('productFeedSettings.export.summarySyncDailyAt', [formatNextSync])"
            size="full"
          />
          <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.summary.productAttributesMapping')"
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
                <TableRowMapping
                  v-for="attribute in attributes"
                  :key="attribute.google"
                  :attribute="attribute"
                />
              </b-tbody>
            </b-table-simple>
            <caption
              v-if="mandatoryAttributesNotMapped"
              class="d-flex ps_gs-fz-12 ps_gs-table-caption mt-3"
            >
              <i class="material-icons-round ps_gs-fz-16 text-warning mr-2">warning_amber</i>
              <p>
                <VueShowdown
                  :markdown="$tc('productFeedSettings.summary.mandatoryAttributesNotMapped',
                                 mandatoryAttributesNotMapped,
                                 [mandatoryAttributesNotMapped])"
                  :extensions="['no-p-tag']"
                  tag="strong"
                  class="font-weight-600"
                />
                <br>
                <VueShowdown
                  :markdown="$t('productFeedSettings.summary.noticeToCompleteMapping',
                                [$options.googleUrl.learnRequirementsProductSpecification])"
                  :extensions="['extended-link', 'no-p-tag']"
                  tag="span"
                />
              </p>
            </caption>
          </product-feed-card-report-card>
        </b-row>
      </b-container>
      <b-form-group
        :label="$t('productFeedSettings.summary.agreementTitle')"
        label-class="h4 font-weight-600 mb-3 d-block p-0 bg-transparent border-0"
      >
        <b-form-checkbox
          data-test-id="buttonCheckbox"
          class="ps_gs-checkbox"
          v-model="acceptSyncSchedule"
        >
          <VueShowdown
            v-if="selectedSyncScheduleIsDefault"
            :markdown="$t('productFeedSettings.summary.agreementCheckboxLabel1Default',
                          {time: formatNextSync})"
          />
          <VueShowdown
            v-else
            :markdown="$t('productFeedSettings.summary.agreementCheckboxLabel1Instant')"
          />
        </b-form-checkbox>
        <b-form-checkbox
          data-test-id="buttonCheckbox"
          class="ps_gs-checkbox mt-n1"
          v-model="understandTerms"
        >
          <VueShowdown :markdown="$t('productFeedSettings.summary.agreementCheckboxLabel2')" />
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
    <settings-footer
      :message="$t('freeListingCard.googleDelay')"
    />
    <VueShowdown
      :markdown="$t('productFeedSettings.export.prohibitedContentNotice',
                    [$options.googleUrl.prohibitedContentGuidelines])"
      :extensions="['extended-link']"
      class="text-muted ps_gs-fz-12 pt-2 mt-4 mb-n3"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import {BTableSimple} from 'bootstrap-vue';
import {VueShowdown} from 'vue-showdown';
import {SyncScheduleStatus} from '../../../../store/modules/product-feed/state';
import googleUrl from '@/assets/json/googleUrl.json';
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import ProductFeedCardReportCard from '../../product-feed-card-report-card';
import ProductFeedCardNextSyncCard from '../../product-feed-card-next-sync-card';
import TableRowMapping from '@/components/product-feed/commons/table-row-mapping';

dayjs.extend(duration);

export default {
  name: 'ProductFeedSettingsSummary',
  components: {
    SettingsFooter,
    ActionsButtons,
    ProductFeedCardReportCard,
    ProductFeedCardNextSyncCard,
    BTableSimple,
    VueShowdown,
    TableRowMapping,
  },
  data() {
    return {
      shippingSettings:
      this.$store.state.productFeed.settings.autoImportShippingSettings
        ? this.$t('productFeedSettings.shipping.automatically')
        : this.$t('productFeedSettings.shipping.manually'),
      refurbishedInputs: ['condition'],
      apparelInputs: ['color', 'size', 'ageGroup', 'gender'],
      acceptSyncSchedule: false,
      understandTerms: false,
      SyncScheduleStatus,
    };
  },
  computed: {
    disabledExportButton() {
      return !(this.acceptSyncSchedule && this.understandTerms);
    },
    nextSyncInHours() {
      // Return how many hours left before next sync
      const now = dayjs();
      const nextSync = dayjs(this.nextSyncDate);
      return dayjs.duration(nextSync.diff(now)).hours();
    },
    nextSyncDate() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'].nextJobAt;
    },
    formatNextSync() {
      return this.$options.filters.timeConverterToHour(this.nextSyncDate);
    },
    nextSyncTotalProducts: {
      get() {
        return this.$store.getters['productFeed/GET_TOTAL_PRODUCTS'];
      },
    },
    targetCountries() {
      // change country code into name with the json list
      return this.$options.filters.changeCountriesCodesToNames(
        this.$store.getters['productFeed/GET_TARGET_COUNTRIES'],
      );
    },
    selectedProductCategories() {
      return localStorage.getItem('selectedProductCategories')
        ? JSON.parse(localStorage.getItem('selectedProductCategories'))
        : [];
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
    getMapping() {
      return this.$store.getters['productFeed/GET_FREE_LISTING_ATTRIBUTES_TO_MAP']
        .filter((item) => this.selectedProductCategories.includes(item.category) || item.category === 'commons')
        .map((attr) => attr.fields)
        .flat(1)
        .map((attribute) => ({
          ...attribute,
          recommended: attribute.recommended.map((recommended) => recommended.name.toLowerCase()).join(', '),
          mapped: attribute.mapped?.map((mapped) => mapped.name).join(', '),
        }))
        .map((final) => ({
          google: final.name,
          prestashop: final.mapped !== undefined ? final.mapped : final.recommended,
        }));
    },
    attributes() {
      return this.getMapping;
    },
    selectedSyncSchedule() {
      return this.$store.getters['productFeed/GET_SYNC_SCHEDULE'];
    },
    selectedSyncScheduleIsDefault() {
      return this.selectedSyncSchedule === false;
    },
  },
  methods: {
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    saveAll() {
      this.disabledExportButton = true;
      this.postDatas();
    },
    previousStep() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 4);
      window.scrollTo(0, 0);
    },
    postDatas() {
      this.$store.dispatch('productFeed/SEND_PRODUCT_FEED_SETTINGS');
      this.$router.push({
        name: 'configuration',
        hash: '#product-feed-card',
      });
      this.disabledExportButton = false;
    },
  },
  googleUrl,
};
</script>
