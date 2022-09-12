<template>
  <section>
    <b-skeleton-wrapper
      :loading="loading"
      class="mb-3"
    >
      <template #loading>
        <b-card>
          <b-skeleton width="85%" />
          <b-skeleton width="55%" />
          <b-skeleton width="70%" />
        </b-card>
      </template>
      <b-card
        no-body
        class="ps_gs-onboardingcard p-3"
        :class="{ 'ps_gs-onboardingcard--disabled': !isEnabled }"
        id="product-feed-card"
      >
        <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center">
            <img
              class="mr-3"
              :src="
                isEnabled
                  ? require('@/assets/images/product-feed-icon.png')
                  : require('@/assets/images/product-feed-icon-grey.png')
              "
              width="40"
              height="40"
              alt=""
            >
            <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
              {{ $t("productFeedCard.title") }}
            </b-card-text>
          </div>
        </div>
        <p
          class="mb-1"
          v-if="!isEnabled"
        >
          {{ $t("productFeedCard.intro") }}
        </p>
        <BadgeListRequirements
          v-if="!isEnabled"
          :badges="['merchantCenterAccount']"
        />
        <div v-if="(isEnabled && toConfigure) || isErrorApi">
          <p>
            {{ $t("productFeedCard.introToConfigure") }}<br>
            <a
              class="ps_gs-fz-12 text-muted"
              :href="$options.googleUrl.productConfiguration"
              target="_blank"
            >
              {{ $t("cta.learnAboutProductConfiguration") }}
            </a>
          </p>
          <product-feed-stepper />
          <div
            class="d-flex justify-content-center justify-content-md-end mt-n1"
            v-if="isEnabled"
          >
            <b-button
              size="sm"
              variant="primary"
              @click="startConfiguration"
              :disabled="isErrorApi"
            >
              {{ $t("cta.configureAndExportProductFeed") }}
            </b-button>
          </div>
        </div>
        <div
          v-if="isEnabled && isErrorApi"
          class="mt-3"
        >
          <b-alert
            variant="warning"
            show
          >
            <VueShowdown
              :markdown="$t('productFeedCard.alertErrorApi')"
            />
            <div
              class="mt-1"
            >
              <b-button
                @click="refresh"
                variant="outline-secondary"
              >
                {{ $t("general.refreshPage") }}
              </b-button>
            </div>
          </b-alert>
        </div>
        <div v-if="isEnabled && !toConfigure && !isErrorApi">
          <b-alert
            :variant="alert === 'FeedSettingSubmissionSuccess' ? 'info' : 'warning'"
            :show="!!alert && alert !== 'ShippingSettingsMissing'"
          >
            <VueShowdown
              :markdown="$t(`productFeedCard.alert${alert}`, alertLink)"
              :extensions="['extended-link']"
            />
            <div
              v-if="alert === 'ProductFeedExists'"
              class="mt-1"
            >
              <b-button variant="outline-secondary">
                {{ $t("cta.overwrite") }}
              </b-button>
            </div>
          </b-alert>
          <h3 class="font-weight-600 ps_gs-fz-14 d-flex align-items-center">
            <i
              class="ps_gs-fz-20 mr-2"
              :class="[`text-${title.color}`, title.materialClass || 'material-icons']"
            >
              {{ title.icon }}
            </i>
            <span>{{ title.message }}</span>
          </h3>
          <div
            class="d-sm-flex align-items-end mb-1"
          >
            <p class="ps_gs-fz-12 text-muted mb-0">
              {{ syncStatus === 'schedule'
                ? $t("productFeedPage.syncStatus.scheduleOn", [nextSyncTime.day, nextSyncTime.time])
                : $t("productFeedCard.nextSync", [nextSyncTime.day, nextSyncTime.time])
              }}
            </p>
            <b-button
              variant="invisible"
              class="bg-transparent p-0 border-0 font-weight-600 ps_gs-fz-13 ml-auto text-primary"
              @click="goToProductFeed()"
            >
              {{ $t("cta.trackProductStatus") }}
            </b-button>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-3 mt-3 pt-2">
            <h3 class="font-weight-600 ps_gs-fz-14 mb-0">
              {{ $t("productFeedSettings.breadcrumb2") }}
            </h3>
          </div>
          <b-alert
            variant="warning"
            :show="!!alert && alert === 'ShippingSettingsMissing'"
          >
            <p>
              {{ $t("productFeedCard.alertShippingSettingsMissingDescription") }}
            </p>
          </b-alert>
          <b-container
            fluid
            class="p-0 mb-0 mt-n1"
          >
            <b-row
              no-gutters
              class="mx-n1"
            >
              <product-feed-card-report-card
                :status="shippingSetupStatus"
                :title="$t('productFeedSettings.deliveryTimeAndRates.shippingSettings')"
                :description="shippingSetupDescription"
                :link="$t('cta.editSettings')"
                :link-to="{ name: 'product-feed-settings',
                            step: 1, params: ProductFeedSettingsPages.SHIPPING_SETUP }"
              />
              <product-feed-card-report-card
                :status="targetCountriesStatus"
                :title="$t('productFeedSettings.deliveryTimeAndRates.title')"
                :sub-title="$t('productFeedSettings.deliveryTimeAndRates.targetCountries')"
                :description="targetCountries.join(', ')"
                :sub-title2="$t('productFeedSettings.deliveryTimeAndRates.title')"
                :description2="deliveryTimeAndRatesDescription"
                :link="$t('cta.editSettings')"
                :link-to="{ name: 'product-feed-settings',
                            step: 2, params: ProductFeedSettingsPages.SHIPPING_SETTINGS }"
              />
              <product-feed-card-report-card
                v-if="isUS"
                :status="taxSettingsStatus"
                :title="$t('productFeedSettings.deliveryTimeAndRates.taxSettings')"
                :description="taxSettings"
                :link="$t('cta.editSettings')"
                :link-to="{ name: 'product-feed-settings',
                            step: 1, params: ProductFeedSettingsPages.SHIPPING_SETUP }"
              />
              <product-feed-card-report-card
                :status="attributeMappingStatus"
                :title="$t('productFeedSettings.steps.attributeMapping')"
                :description="attributeMapping.join(', ')"
                :link="$t('cta.editProductAttributes')"
                :link-to="{ name: 'product-feed-settings',
                            step: 3, params: ProductFeedSettingsPages.ATTRIBUTE_MAPPING}"
              />
            </b-row>
          </b-container>
        </div>
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script lang="ts">
import {VueShowdown} from 'vue-showdown';
import {defineComponent} from 'vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import googleUrl from '@/assets/json/googleUrl.json';
import ProductFeedStepper from '@/components/product-feed/product-feed-stepper';
import ProductFeedCardReportCard from './product-feed-card-report-card';
import BadgeListRequirements from '../commons/badge-list-requirements';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';

export default defineComponent({
  name: 'ProductFeedCard',
  components: {
    ProductFeedStepper,
    ProductFeedCardReportCard,
    BadgeListRequirements,
    VueShowdown,
  },
  data() {
    return {
      ProductFeedSettingsPages,
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
      required: true,
    },
    loading: {
      type: Boolean,
      default: true,
      required: true,
    },
    categoriesTotal: {
      type: Number,
      required: false,
      default: 0,
    },
    categoriesMapped: {
      type: Number,
      default: 0,
      required: false,
    },
    syncRules: {
      type: Array,
      default: () => [],
      required: false,
    },
    syncRulesDetails: {
      type: Array,
      default: () => [],
      required: false,

    },
  },
  computed: {
    getProductFeedSettings() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_SETTINGS'];
    },
    getProductFeedStatus() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'];
    },
    nextSyncTime() {
      return {
        day: this.$options.filters.timeConverterToDate(
          this.getProductFeedStatus.nextJobAt,
        ),
        time: this.$options.filters.timeConverterToHour(
          this.getProductFeedStatus.nextJobAt,
        ),
      };
    },
    isUS() {
      return this.$store.getters['productFeed/GET_TARGET_COUNTRIES'].includes('US');
    },
    toConfigure() {
      return !this.$store.state.productFeed.isConfigured;
    },
    targetCountries() {
      return this.$options.filters.changeCountriesCodesToNames(
        this.$store.getters['productFeed/GET_TARGET_COUNTRIES'],
      );
    },
    shippingSetupDescription() {
      if (this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']) {
        return this.$t('productFeedSettings.shippingSetup.laterOption.summary');
      }

      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.IMPORT) {
        return this.$t('productFeedSettings.shippingSetup.estimateOption.summary');
      }
      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.ESTIMATE) {
        return this.$t('productFeedSettings.shippingSetup.importOption.summary');
      }

      return this.$t('productFeedCard.missingInformation');
    },
    shippingSetupStatus() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']
        ? 'warning'
        : 'success';
    },
    deliveryTimeAndRatesDescription() {
      if (this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']) {
        return '--';
      }

      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.IMPORT) {
        return this.$t('productFeedSettings.deliveryTimeAndRates.importOption.summary');
      }
      if (this.getProductFeedSettings.shippingSetup === ShippingSetupOption.ESTIMATE) {
        if (this.targetCountries.length === 1) {
          return this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.singleCountry');
        }
        return this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.multiCountriesFlatRateForAll');
      }

      return this.$t('productFeedCard.missingInformation');
    },
    targetCountriesStatus() {
      return this.targetCountries.length ? 'success' : 'warning';
    },
    getAttributeMapping() {
      return this.$store.getters['productFeed/GET_ATTRIBUTE_MAPPING'];
    },
    attributeMappingStatus() {
      return this.getAttributeMapping ? 'success' : 'warning';
    },
    taxSettings() {
      if (this.getProductFeedSettings.autoImportTaxSettings === undefined) {
        return this.$t('productFeedCard.missingInformation');
      }
      return this.getProductFeedSettings.autoImportTaxSettings
        ? this.$t('productFeedSettings.deliveryTimeAndRates.automatically')
        : this.$t('productFeedSettings.deliveryTimeAndRates.manually');
    },
    taxSettingsStatus() {
      // TODO BATCH 2
      // TODO retrieve tax settings from backend
      return 'success';
    },
    attributeMapping() {
      const arr = [];
      const getMapping = this.getAttributeMapping;
      Object.keys(getMapping).forEach((key) => {
        if (getMapping[key]) {
          getMapping[key].forEach((item) => arr.push(item.id));
        }
      });
      return arr;
    },
    lastSync() {
      return {
        day: this.$options.filters.timeConverterToDate(
          this.getProductFeedStatus?.lastUpdatedAt ?? this.getProductFeedStatus?.jobEndedAt,
        ),
        time: this.$options.filters.timeConverterToHour(
          this.getProductFeedStatus?.lastUpdatedAt ?? this.getProductFeedStatus?.jobEndedAt,
        ),
        // ToDo: Make the API return this information
        totalProducts: 0,
      };
    },
    title() {
      if (this.syncStatus === 'schedule') {
        return {
          icon: 'schedule',
          color: 'primary',
          message: this.$i18n.t('productFeedPage.syncStatus.readyForExport'),
        };
      }
      if (this.syncStatus === 'failed') {
        return {
          icon: 'info_outlined',
          color: 'danger',
          message: this.$i18n.t('productFeedCard.syncFailedAt', [
            this.lastSync.day,
            this.lastSync.time,
          ]),
        };
      }
      return {
        icon: 'check_circle',
        color: 'success',
        message: this.$i18n.tc('productFeedCard.syncSuccess',
          this.lastSync.totalProducts,
          [
            this.lastSync.totalProducts,
            this.lastSync.day,
            this.lastSync.time,
          ],
        ),
      };
    },
    alertLink() {
      if (this.alert === 'Failed') {
        return [this.$options.googleUrl.syncFailed];
      }
      return null;
    },
    hasMapping() {
      return this.categoriesMapped > 0;
    },
    alert() {
      if (this.getProductFeedStatus.success === false && this.getProductFeedStatus.jobEndedAt
      && this.getProductFeedStatus.lastUpdatedAt) {
        return 'Failed';
      }
      if (this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']) {
        return 'ShippingSettingsMissing';
      }
      if (
        this.getProductFeedStatus.lastUpdatedAt === null
      && this.getProductFeedStatus.success === false
      ) {
        return 'FeedSettingSubmissionSuccess';
      }
      // TODO: ProductFeedExists > Overwrite needed
      // if (something) {
      //   return 'ProductFeedExists';
      // }
      return null;
    },
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
    isErrorApi() {
      return this.$store.state.productFeed.errorAPI;
    },
    allValidationSummary() {
      return this.$store.state.productFeed.validationSummary;
    },
    nbProductsCantSync() {
      return this.allValidationSummary.disapprovedItems;
    },
    nbProductsReadyToSync() {
      return this.allValidationSummary.activeItems;
    },
    excludedProductsDetails() {
      return this.allValidationSummary.disapprovedItems;
    },
  },
  methods: {
    startConfiguration() {
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.SHIPPING_SETUP,
        },
      });
      this.$segment.track('[GGL] Start Product feed configuration', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    goToProductFeedSettings(params) {
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: params,
        },
      });
    },
    refresh() {
      this.$router.go();
    },
    goToProductFeed() {
      this.$router.push({
        name: 'product-feed',
      });
    },
  },
  googleUrl,
});
</script>
