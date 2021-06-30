<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled': !isEnabled }"
  >
    <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
      <div class="d-flex align-items-center">
        <img
          class="mr-3"
          :src="
            isEnabled
              ? require('@/assets/images/product-feed-icon.svg')
              : require('@/assets/images/product-feed-icon-grey.svg')
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
      class="ps_gs-fz-12"
      v-if="!isEnabled"
    >
      {{ $t("productFeedCard.intro") }}
    </p>
    <BadgeListRequirements
      v-if="!isEnabled"
      :badges="['merchantCenterAccount']"
    />
    <div v-if="isEnabled && toConfigure">
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
      <stepper
        class="mt-2"
        :steps="steps"
        :active-step="1"
      />
      <div
        class="d-flex justify-content-center justify-content-md-end mt-n1"
        v-if="isEnabled"
      >
        <b-button
          size="sm"
          variant="primary"
          @click="startConfiguration"
        >
          {{ $t("cta.configureAndExportProductFeed") }}
        </b-button>
      </div>
    </div>
    <div v-if="isEnabled && !toConfigure">
      <b-alert
        :variant="alertVariant"
        :show="!!alert"
      >
        <VueShowdown
          :markdown="!!alert && $t(`productFeedCard.alert${alert}`, alertLink)"
          :extensions="['targetlink']"
        />
        <div
          v-if="alert === 'ProductFeedExists'"
          class="mt-1"
        >
          <b-button variant="outline-secondary">
            {{ $t('cta.overwrite') }}
          </b-button>
        </div>
      </b-alert>
      <h3
        class="font-weight-600 ps_gs-fz-14 d-flex align-items-center"
      >
        <i
          class="ps_gs-fz-20 mr-2"
          :class="[
            `text-${title.color}`,
            title.materialClass || 'material-icons'
          ]"
        >
          {{ title.icon }}
        </i>
        <span>{{ title.message }}</span>
      </h3>
      <div class="d-sm-flex align-items-end mb-1">
        <p class="ps_gs-fz-12 text-muted mb-0">
          {{ $t("productFeedPage.syncStatus.scheduleOn", [nextSyncTime]) }}
        </p>
        <a
          href=""
          class="font-weight-600 ps_gs-fz-13 text-right ml-auto"
        >
          {{ $t('cta.trackProductStatus') }}
        </a>
        <!-- Not in free plan -->
        <!-- <b-button
          v-if="syncStatus === 'failed'"
          variant="primary"
          class="d-block mx-auto my-2 my-sm-0 ml-sm-3 mr-sm-0"
        >
          <span class="material-icons">
            autorenew
          </span>
          {{ $t('cta.forceSync') }}
        </b-button> -->
      </div>
      <!--  NOT IN BATCH 1 -->
      <!-- <b-container
        fluid
        class="p-0 mb-2"
      >
        <b-row
          no-gutters
          class="mx-n1"
        >
          <product-feed-card-report-products-card
            status="success"
            :title="$t('productFeedCard.productsReadyToBeSynced')"
            :nb-products="nbProductsReadyToSync"
            :sync-status="syncStatus"
          />
          <product-feed-card-report-products-card
            status="warning"
            :title="$t('productFeedCard.productsWithProblems')"
            :nb-products="nbProductsCantSync"
            :sync-status="syncStatus"
            :link="$t('cta.reviewProblems')"
            link-to="#"
          />
        </b-row>
      </b-container> -->
      <div class="d-flex justify-content-between align-items-center mb-3 mt-3">
        <h3 class="font-weight-600 ps_gs-fz-14 mb-0">
          {{ $t("productFeedSettings.breadcrumb2") }}
        </h3>
      </div>
      <b-container
        fluid
        class="p-0 mb-0"
      >
        <b-row
          no-gutters
          class="mx-n1"
        >
          <product-feed-card-report-card
            :status="targetCountriesStatus"
            :title="$t('productFeedSettings.shipping.targetCountries')"
            :description="targetCountries.join(', ')"
            :link="$t('cta.editCountries')"
            :link-to="{type : 'routeStep', name: 'product-feed-settings', step: 1}"
          />
          <product-feed-card-report-card
            :status="shippingSettingsStatus"
            :title="$t('productFeedSettings.shipping.shippingSettings')"
            :description="shippingSettings"
            :link="$t('cta.editSettings')"
            :link-to="{type : 'routeStep', name: 'product-feed-settings', step: 1}"
          />
          <product-feed-card-report-card
            v-if="isUS"
            :status="taxSettingsStatus"
            :title="$t('productFeedSettings.shipping.taxSettings')"
            :description="taxSettings"
            :link="$t('cta.editSettings')"
            :link-to="{type : 'routeStep', name: 'product-feed-settings', step: 1}"
          />
          <!--  NOT IN BATCH 1 -->
          <!-- <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.steps.syncRules')"
            :description="syncRules.join(', ')"
            :details="syncRulesDetails.join(', ')"
            :link="$t('cta.editRules')"
            link-to="#"
          />
           <product-feed-card-report-card
            status="success"
            :title="$t('productFeedCard.excludedProducts')"
            :description="`
              ${$t('productFeedCard.excludedProducts')} (${excludedProductsDetails.length})
            `"
            :details="excludedProductsDetails.join(', ')"
            :link="$t('cta.editRules')"
            link-to="#"
          /> -->
          <product-feed-card-report-card
            :status="attributeMappingStatus"
            :title="$t('productFeedSettings.steps.attributeMapping')"
            :description="attributeMapping.join(', ') + '...'"
            :link="$t('cta.editProductAttributes')"
            :link-to="{type : 'routeStep', name: 'product-feed-settings', step: 3}"
          />
          <!--  NOT IN BATCH 1 -->
          <!-- <product-feed-card-report-mapped-categories-card
            :has-mapping="hasMapping"
            :categories-mapped="categoriesMapped"
            :categories-total="categoriesTotal"
          /> -->
        </b-row>
      </b-container>
    </div>
  </b-card>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';
import Stepper from '../commons/stepper';
import ProductFeedCardReportCard from './product-feed-card-report-card';
import countriesSelectionOptions from '../../assets/json/countries.json';
//  eslint-disable-next-line
// import ProductFeedCardReportMappedCategoriesCard from './product-feed-card-report-mapped-categories-card';
// import ProductFeedCardReportProductsCard from './product-feed-card-report-products-card';
import BadgeListRequirements from '../commons/badge-list-requirements';

export default {
  name: 'ProductFeedCard',
  components: {
    Stepper,
    ProductFeedCardReportCard,
    // NOT IN BATCH 1
    BadgeListRequirements,
    // ProductFeedCardReportMappedCategoriesCard,
    // ProductFeedCardReportProductsCard,
  },
  data() {
    return {
      steps: [
        {
          title: this.$i18n.t('productFeedSettings.steps.shippingSettings'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.syncRules'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.attributeMapping'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.categoryMapping'),
        },
        // {
        //   title: this.$i18n.t('productFeedSettings.steps.exportFeed'),
        // },
      ],
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    syncStatus: {
      type: String,
      default: null,
      validator(value) {
        return [null, 'success', 'warning', 'failed', 'schedule'].indexOf(value) !== -1;
      },
    },
    categoriesTotal: {
      type: Number,
    },
    categoriesMapped: {
      type: Number,
      default: 0,
    },

    nbProductsReadyToSync: {
      type: Number,
    },
    nbProductsCantSync: {
      type: Number,
    },
    taxSettings: {
      type: String,
    },
    syncRules: {
      type: Array,
    },
    syncRulesDetails: {
      type: Array,
    },
    excludedProductsDetails: {
      type: Array,
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
      return this.$options.filters.timeConverterToDate(
        this.getProductFeedStatus.nextJobAt,
      );
    },
    isUS() {
      return this.targetCountries.includes('US');
    },
    toConfigure() {
      return !this.$store.state.productFeed.isConfigured;
    },
    targetCountries() {
      const datas = this.$store.getters['productFeed/GET_ACTIVE_COUNTRIES'];
      const countries = this.$options.countriesSelectionOptions;
      return this.$options.filters.changeCountryCodeToName(datas, countries);
    },
    shippingSettings() {
      return this.getProductFeedSettings.autoImportShippingSettings
        ? this.$t('productFeedSettings.shipping.automatically')
        : this.$t('productFeedSettings.shipping.manually');
    },
    shippingSettingsStatus() {
      return this.getProductFeedSettings.autoImportShippingSettings !== undefined ? 'success' : 'warning';
    },
    targetCountriesStatus() {
      return this.targetCountries.length ? 'success' : 'warning';
    },
    attributeMappingStatus() {
      return this.getProductFeedSettings.attributeMapping ? 'success' : 'warning';
    },
    taxSettingsStatus() {
    // TODO retrieve tax settings from backend
      return 'warning';
    },
    productFeedSyncEnabled() {
      return this.getProductFeedStatus.enabled;
    },
    attributeMapping: {
    // TODO BATCH 2 refacto when dynamic fields
    // TODO  BATCH 2 + to push also the long description attribute if needed
      get() {
        const arr = [];
        Object.keys(this.getProductFeedSettings.attributeMapping)
          .forEach((key) => {
            // Because the variables names contain "custom" and "Attribute"
            if (key === 'customColorAttribute') {
              arr.push('Color', 'Age', 'Gender', 'Size');
            }
            if (key === 'customConditionAttribute') {
              arr.push('Condition');
            }
          });
        return arr;
      },
    },
    lastSync() {
      return {
        day: this.$options.filters.timeConverterToDate(
          this.getProductFeedStatus?.jobEndedAt,
        ),
        time: this.$options.filters.timeConverterToHour(
          this.getProductFeedStatus?.jobEndedAt,
        ),
        totalProducts: this.getProductFeedSettings.productsPerBatchSync,
      };
    },
    title() {
      if (this.syncStatus === 'schedule') {
        return {
          icon: 'schedule',
          color: 'primary',
          message: this.$i18n.t('productFeedPage.syncStatus.readyForExport'),
        };
      } if (this.syncStatus === 'failed') {
        return {
          icon: 'error_outline',
          color: 'danger',
          message: this.$i18n.t('productFeedCard.syncFailedAt', [
            this.lastSync.day,
            this.lastSync.time,
          ]),
        };
      } if (this.syncStatus === 'warning') {
        return {
          icon: 'warning',
          color: 'warning',
          materialClass: 'material-icons-round',
          message: this.$i18n.t('productFeedCard.syncCantPerform'),
        };
      }
      return {
        icon: 'check_circle',
        color: 'success',
        message: this.$i18n.t('productFeedCard.syncSuccess', [
          this.lastSync.totalProducts,
          this.lastSync.day,
          this.lastSync.time,
        ]),
      };
    },
    alertVariant() {
      return this.alert === 'Success' ? 'success' : 'warning';
    },
    alertLink() {
      if (this.alert === 'Failed') {
        return [this.$options.googleUrl.syncFailed];
      } if (this.alert === 'ShippingSettingsMissing') {
        return [this.$options.googleUrl.shippingSettingsMissing];
      }
      return null;
    },
    hasMapping() {
      return this.categoriesMapped > 0;
    },
    alert() {
      // TODO How to know if 'ProductFeedExists'
      if (!this.productFeedSyncEnabled) {
        return 'ProductFeedDeactivated';
      }
      if (!this.toConfigure /* TODO: Check feed in under review */) {
        return 'GoogleIsReviewingProducts';
      } if (this.getProductFeedStatus.failedSyncs.length) {
        return 'Failed';
      } if (
        this.getProductFeedSettings.autoImportShippingSettings === undefined
      ) {
        return 'ShippingSettingsMissing';
      }
      return null;
    },
  },
  methods: {
    startConfiguration() {
      this.$router.push({
        path: '/product-feed-settings',
      });
    },

  },
  googleUrl,
  countriesSelectionOptions,
};
</script>
