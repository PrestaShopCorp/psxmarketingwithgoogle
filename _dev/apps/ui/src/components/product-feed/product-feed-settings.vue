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
              src="@/assets/images/product-feed-icon.svg"
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
      <product-feed-stepper
        :active-step="getActiveStep"
      />
      <shipping-setup
        v-if="$route.params.step === ProductFeedSettingsPages.SHIPPING_SETUP"
        @cancelProductFeedSettingsConfiguration="productFeedCancelProcess"
      />
      <delivery-time-and-rates
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
      <product-feed-settings-summary
        v-bind="$attrs"
        v-if="$route.params.step === ProductFeedSettingsPages.SUMMARY"
        @cancelProductFeedSettingsConfiguration="productFeedCancelProcess"
      />
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ProductFeedSettingsSteps from '@/enums/product-feed/product-feed-settings-steps';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import ProductFeedStepper from '@/components/product-feed/product-feed-stepper.vue';
import ShippingSetup from '@/components/product-feed/settings/shipping-setup/shipping-setup.vue';
import DeliveryTimeAndRates from '@/components/product-feed/settings/delivery-time-and-rates/delivery-time-and-rates.vue';
import AttributeMapping from '@/components/product-feed/settings/attribute-mapping/attribute-mapping.vue';
import SyncSchedule from '@/components/product-feed/settings/sync-schedule/sync-schedule.vue';
import ProductFeedSettingsSummary from '@/components/product-feed/settings/summary/summary.vue';

export default defineComponent({
  name: 'ProductFeedSettings',
  components: {
    ProductFeedStepper,
    ShippingSetup,
    DeliveryTimeAndRates,
    AttributeMapping,
    SyncSchedule,
    ProductFeedSettingsSummary,
  },
  data() {
    return {
      ProductFeedSettingsPages,
    };
  },
  computed: {
    getActiveStep() {
      const indexOfRoute = ProductFeedSettingsSteps.indexOf(this.$route.params.step);

      if (indexOfRoute > 0) {
        return indexOfRoute;
      }
      return 0;
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
});
</script>
