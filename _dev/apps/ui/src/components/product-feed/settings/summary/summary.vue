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
            :description="
              selectedSyncScheduleIsDefault
                ? formatNextSyncDate
                : $t('productFeedSettings.summary.syncScheduledNow')
            "
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
        <product-feed-summary-cards
          :display-attribute-mapping-simple-card="false"
          display-sync-card
        />
        <b-row
          no-gutters
          class="mx-n1"
        >
          <b-col>
            <product-feed-card-report-card
              status="success"
              :title="$t('productFeedSettings.summary.productAttributesMapping')"
              :link="$t('cta.editProductAttributes')"
              :link-to="{ name: 'product-feed-settings',
                          step: 3,params: ProductFeedSettingsPages.ATTRIBUTE_MAPPING}"
              size="full"
            >
              <VueShowdown
                v-if="getNumberOfAttributesMapped"
                class="ps_gs-fz-12"
                :markdown="
                  $tc(
                    'productFeedSettings.summary.attributeMapped',
                    getNumberOfAttributesMapped,
                    [getNumberOfAttributesMapped]
                  )
                "
                :extensions="['no-p-tag']"
              />
              <b-table-simple
                stacked="md"
                class="mt-2 centered-mapping-summary"
                borderless
                table-class="border-bottom-0 ps_gs-table-attribute-mapping"
              >
                <b-thead>
                  <b-tr
                    class="ps-ps-header-attribute-mapping"
                  >
                    <b-th
                      class="
                        font-weight-600
                        ps_gs-fz-12
                        table-border-bottom
                      "
                    >
                      <div class="text-center mb-2 float-left">
                        <img
                          class="rounded-circle mb-1"
                          src="@/assets/images/google-icon-grey.svg"
                          width="20"
                          height="20"
                        >
                        <p>
                          {{ $t('productFeedSettings.summary.tableHeader1') }}
                        </p>
                      </div>
                    </b-th>
                    <b-th
                      class="
                        font-weight-600
                        ps_gs-fz-12
                        table-border-bottom
                      "
                    >
                      <div class="text-center mb-2 float-right">
                        <img
                          src="@/assets/images/table-chart.svg"
                          class="mb-1"
                          width="20"
                          height="20"
                        >
                        <p>
                          {{ $t("productFeedSettings.summary.tableHeader2") }}
                        </p>
                      </div>
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
              <b-alert
                class="mb-0 mt-3"
                v-if="mandatoryAttributesNotMapped"
                variant="warning"
                show
              >
                <VueShowdown
                  :markdown="
                    $tc(
                      'productFeedSettings.summary.mandatoryAttributesNotMapped',
                      mandatoryAttributesNotMapped,
                      [mandatoryAttributesNotMapped]
                    )
                  "
                  :extensions="['no-p-tag']"
                  tag="strong"
                  class="font-weight-600"
                />
                <br>
                <VueShowdown
                  :markdown="
                    $t('productFeedSettings.summary.noticeToCompleteMapping', [
                      $options.googleUrl.learnRequirementsProductSpecification,
                    ])
                  "
                  :extensions="['extended-link', 'no-p-tag']"
                  tag="span"
                />
              </b-alert>
            </product-feed-card-report-card>
          </b-col>
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
            :markdown="
              $t('productFeedSettings.summary.agreementCheckboxLabel1Default', {
                time: formatNextSync,
              })
            "
          />
          <VueShowdown
            v-else
            :markdown="
              $t('productFeedSettings.summary.agreementCheckboxLabel1Instant')
            "
          />
        </b-form-checkbox>
        <b-form-checkbox
          data-test-id="buttonCheckbox"
          class="ps_gs-checkbox mt-n1"
          v-model="understandTerms"
        >
          <VueShowdown
            :markdown="
              $t('productFeedSettings.summary.agreementCheckboxLabel2')
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
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import googleUrl from '@/assets/json/googleUrl.json';
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import ProductFeedCardReportCard from '@/components/product-feed/product-feed-card-report-card.vue';
import ProductFeedCardNextSyncCard from '@/components/product-feed/product-feed-card-next-sync-card.vue';
import TableRowMapping from '@/components/product-feed/commons/table-row-mapping.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import ProductFeedSummaryCards from '@/components/product-feed/summary/product-feed-summary-cards.vue';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';

dayjs.extend(duration);

export default defineComponent({
  name: 'ProductFeedSettingsSummary',
  components: {
    SettingsFooter,
    ActionsButtons,
    ProductFeedCardReportCard,
    ProductFeedCardNextSyncCard,
    BTableSimple,
    VueShowdown,
    TableRowMapping,
    ProductFeedSummaryCards,
  },
  data() {
    return {
      ProductFeedSettingsPages,
      refurbishedInputs: ['condition'],
      apparelInputs: ['color', 'size', 'ageGroup', 'gender'],
      acceptSyncSchedule: false,
      understandTerms: false,
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
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS']
        .nextJobAt;
    },
    formatNextSyncDate() {
      return this.$options.filters.timeConverterToStringifiedDate(
        this.nextSyncDate,
      );
    },
    formatNextSync() {
      return this.$options.filters.timeConverterToHour(this.nextSyncDate);
    },
    nextSyncTotalProducts: {
      get() {
        return this.$store.getters['productFeed/GET_TOTAL_PRODUCTS_READY_TO_SYNC'];
      },
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
      this.$segment.track('[GGL] Product feed config - Export catalog', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.postDatas();
    },
    previousStep() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 5);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.SYNC_SCHEDULE,
        },
      });
      window.scrollTo(0, 0);
    },
    postDatas() {
      this.$store.dispatch('productFeed/SEND_PRODUCT_FEED_SETTINGS');
      this.$emit('save');
    },
  },
  mounted() {
    this.$store.dispatch('productFeed/REQUEST_ATTRIBUTE_MAPPING');
  },

  googleUrl,
});
</script>
