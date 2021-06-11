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
      <div
        v-if="!toConfigure && isEnabled"
        class="ml-auto mb-0"
      >
        <span class="ps-switch ps-switch-sm">
          <input
            @click.prevent="toggle"
            type="radio"
            name="switchEnable"
            :value="false"
            v-model="productFeedSyncEnabled"
            :checked="productFeedSyncEnabled"
          >
          <label for="example_off_3">{{ $t('cta.disabled') }}</label>
          <input
            @click.native="toggle"
            type="radio"
            name="switchEnable"
            :value="true"
            v-model="productFeedSyncEnabled"
            :checked="productFeedSyncEnabled"
          >
          <label for="example_on_3">{{ $t('cta.enabled') }}</label>
          <span class="slide-button"   />
        </span>
      </div>
    </div>
    <p
      class="ps_gs-fz-12"
      v-if="!isConfigurationStarted"
    >
      {{ $t("productFeedCard.intro") }}
    </p>
    <BadgeListRequirements
      v-if="!isEnabled"
      :badges="['merchantCenterAccount']"
    />
    <div v-if="isEnabled && toConfigure">
      <p v-if="!isConfigurationStarted">
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
          v-if="!isConfigurationStarted"
          size="sm"
          variant="primary"
          @click="startConfiguration"
        >
          {{ $t("cta.configureAndExportProductFeed") }}
        </b-button>
        <product-feed-settings-shipping v-else />
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
            {{ $t('cta.overwriteProductFeed') }}
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
            :link-to="{type : 'routeStep', where: '/product-feed', step: 1}"
          />
          <product-feed-card-report-card
            :status="shippingSettingsStatus"
            :title="$t('productFeedSettings.shipping.shippingSettings')"
            :description="shippingSettings"
            :link="$t('cta.editSettings')"
            :link-to="{type : 'routeStep', where: '/product-feed', step: 1}"
          />
          <product-feed-card-report-card
            v-if="isUS"
            :status="taxSettingsStatus"
            :title="$t('productFeedSettings.shipping.taxSettings')"
            :description="taxSettings"
            :link="$t('cta.editSettings')"
            :link-to="{type : 'routeStep', where: '/product-feed', step: 1}"
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
            :link="$t('cta.editAttributeMapping')"
            :link-to="{type : 'routeStep', where: '/product-feed', step: 3}"
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
import ProductFeedSettingsShipping from './product-feed-settings-shipping';
import ProductFeedCardReportCard from './product-feed-card-report-card';
//  eslint-disable-next-line
// import ProductFeedCardReportMappedCategoriesCard from './product-feed-card-report-mapped-categories-card';
// import ProductFeedCardReportProductsCard from './product-feed-card-report-products-card';
import ProductFeedCardReportMappedCategoriesCard from './product-feed-card-report-mapped-categories-card';
import ProductFeedCardReportProductsCard from './product-feed-card-report-products-card';
import BadgeListRequirements from '../commons/badge-list-requirements';

export default {
  name: 'ProductFeedCard',
  components: {
    Stepper,
    ProductFeedSettingsShipping,
    ProductFeedCardReportCard,
    // NOT IN BATCH 1
    // ProductFeedCardReportMappedCategoriesCard,
    // ProductFeedCardReportProductsCard,
    ProductFeedCardReportMappedCategoriesCard,
    ProductFeedCardReportProductsCard,
    BadgeListRequirements,

  },
  data() {
    return {
      isSwitched: false,
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
      // TODO : retrieve products from backend for totalProducts
      lastSync: {
        day: this.$options.filters.timeConverterToDate(
          this.$store.state.productFeed.productFeed.status.lastSync,
        ),
        time: this.$options.filters.timeConverterToHour(
          this.$store.state.productFeed.productFeed.status.lastSync,
        ),
        totalProducts: 200,
      },
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

    nextSyncTime() {
      return this.$options.filters.timeConverterToDate(
        this.$store.state.productFeed.productFeed.status.nextSync,
      );
    },
    isUS() {
      return this.targetCountries.includes('US');
    },
    isConfigurationStarted() {
      return this.$store.state.productFeed.productFeed.isConfigurationStarted;
    },
    toConfigure() {
      return !this.$store.state.productFeed.productFeed.isConfigured;
    },
    targetCountries() {
      return this.$store.state.productFeed.productFeed.settings.targetCountries;
    },
    shippingSettings() {
      return this.$store.state.productFeed.productFeed.settings.autoImportShippingSettings
        ? this.$t('productFeedSettings.shipping.automatically')
        : this.$t('productFeedSettings.shipping.manually');
    },
    shippingSettingsStatus() {
      return this.$store.state.productFeed.productFeed.settings.autoImportShippingSettings !== undefined ? 'success' : 'warning';
    },
    targetCountriesStatus() {
      return this.$store.state.productFeed.productFeed.settings.targetCountries.length ? 'success' : 'warning';
    },
    attributeMappingStatus() {
      return this.$store.state.productFeed.productFeed.settings.sellApparel || this.$store.state.productFeed.productFeed.settings.sellRefurbished ? 'success' : 'warning';
    },
    taxSettingsStatus() {
    //  TODO retrieve tax settings from backend
      return 'warning';
    },
    productFeedSyncEnabled: {
      get() {
        return this.$store.state.productFeed.productFeed.status.isSyncEnabled;
      },
      set() {
        this.$emit('toggleSync');
      },
    },
    attributeMapping: {
    //  TODO maybe refacto to get also the attribute long description if needed
      get() {
        const arr = [];
        Object.keys(this.$store.state.productFeed.productFeed.settings.sellApparel)
          .forEach((key) => {
            arr.push(key);
          });
        return arr.concat(this.$store.state.productFeed.productFeed.settings.sellRefurbished);
      },
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
      if (!this.$store.state.productFeed.productFeed.status.isSyncEnabled) {
        return 'ProductFeedDeactivated';
      } if (this.$store.state.productFeed.productFeed.status.isSyncEnabled) {
        return 'GoogleIsReviewingProducts';
      } if (this.$store.state.productFeed.productFeed.settings.successfulSyncs.length
     && !this.$store.state.productFeed.productFeed.settings.failedSyncs) {
        return 'Success';
      } if (this.$store.state.productFeed.productFeed.settings.failedSyncs.length) {
        return 'Failed';
      } if (
        this.$store.state.productFeed.productFeed.settings.autoImportShippingSettings === undefined
      ) {
        return 'ShippingSettingsMissing';
      }
      return null;
    },
  },
  methods: {
    startConfiguration() {
      this.$store.commit('productFeed/TOGGLE_CONFIGURATION_STARTED');
      this.$router.push({
        path: '/product-feed',
      });
    },
    toggle() {
      this.$emit('toggleSync');
    },
  },
  googleUrl,
};
</script>
