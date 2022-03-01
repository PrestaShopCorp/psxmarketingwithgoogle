<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard"
  >
    <b-card-header
      header-tag="nav"
      header-class="px-3 py-1"
    >
      <ol class="list-inline mb-0 d-sm-flex align-items-center ps_gs-breadcrumb">
        <li class="list-inline-item ps_gs-breadcrumb__item">
          <router-link
            class="d-flex align-items-center ps_gs-breadcrumb__link"
            :to="{name: 'configuration'}"
          >
            <img
              class="ps_gs-breadcrumb__icon"
              src="@/assets/images/product-feed-icon.png"
              width="40"
              height="40"
              alt=""
            >
            {{ $t('productFeedSettings.breadcrumb1') }}
          </router-link>
        </li>
        <li class="list-inline-item ps_gs-breadcrumb__item ml-4 ml-sm-0">
          {{ $t('productFeedSettings.breadcrumb2') }}
        </li>
      </ol>
    </b-card-header>
    <b-card-body
      body-class="p-3 p-md-4"
    >
      <stepper
        :steps="steps"
        :active-step="activeStep"
      />
      <target-country
        v-if="$route.params.step === ProductFeedSettingsPages.TARGET_COUNTRY"
        @cancelProductFeedSettingsConfiguration="productFeedCancelProcess"
      />
      <shipping-settings
        v-if="$route.params.step === ProductFeedSettingsPages.SHIPPING_SETTINGS"
        v-bind="$attrs"
        @cancelProductFeedSettingsConfiguration="productFeedCancelProcess"
      />
      <attribute-mapping
        v-if="$route.params.step === ProductFeedSettingsPages.ATTRIBUTE_MAPPING"
        @cancelProductFeedSettingsConfiguration="productFeedCancelProcess"
      />
      <sync-schedule
        v-if="$route.params.step === ProductFeedSettingsPages.SYNC_SCHEDULE"
        @cancelProductFeedSettingsConfiguration="productFeedCancelProcess"
      />
      <Summary
        v-bind="$attrs"
        v-if="$route.params.step === ProductFeedSettingsPages.SUMMARY"
        @cancelProductFeedSettingsConfiguration="productFeedCancelProcess"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import ProductFeedSettingsSteps from '@/enums/product-feed/product-feed-settings-steps';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import Stepper from '../commons/stepper';
import TargetCountry from './settings/target-countries/target-countries.vue';
import ShippingSettings from './settings/shipping-settings/shipping-settings.vue';
import AttributeMapping from './settings/attribute-mapping/attribute-mapping.vue';
import SyncSchedule from './settings/sync-schedule/sync-schedule.vue';
import Summary from './settings/summary/summary';

export default {
  name: 'ProductFeedSettings',
  components: {
    Stepper,
    TargetCountry,
    ShippingSettings,
    AttributeMapping,
    SyncSchedule,
    Summary,
  },
  data() {
    return {
      ProductFeedSettingsPages,
    };
  },
  computed: {
    activeStep() {
      if (this.$store.state.productFeed.stepper > 0) {
        return this.$store.state.productFeed.stepper;
      }
      const indexOfRoute = ProductFeedSettingsSteps.indexOf(this.$route.params.step);

      if (indexOfRoute > 0) {
        return indexOfRoute;
      }
      return 0;
    },
    steps() {
      return [
        {
          title: this.$i18n.t('productFeedSettings.steps.targetCountry'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.shippingSettings'),
          notClickable: !this.$store.state.productFeed.settings.autoImportShippingSettings,
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.attributeMapping'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.syncSchedule'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.summary'),
        },
      ];
    },
  },
  mounted() {
    this.$store.dispatch('productFeed/REQUEST_SHOP_TO_GET_ATTRIBUTE');
  },
  methods: {
    productFeedCancelProcess() {
      this.$emit('cancelProductFeedProcess');
    },
  },
};
</script>
