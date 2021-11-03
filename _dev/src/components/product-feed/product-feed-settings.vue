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
      <product-feed-settings-shipping
        v-if="activeStep == 1"
        @cancelProductFeedSettingsConfiguration="productFeedCancelProcess"
      />
      <product-feed-settings-export
        v-if="activeStep == 2"
        v-bind="$attrs"
        @cancelProductFeedSettingsConfiguration="productFeedCancelProcess"
      />
      <product-feed-settings-attribute-mapping
        v-if="activeStep == 3"
        @cancelProductFeedSettingsConfiguration="productFeedCancelProcess"
      />
      <product-feed-settings-summary
        v-bind="$attrs"
        v-if="activeStep == 4"
        @cancelProductFeedSettingsConfiguration="productFeedCancelProcess"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import Stepper from '../commons/stepper';
import ProductFeedSettingsShipping from './settings/target-countries/target-countries';
import ProductFeedSettingsExport from './product-feed-settings-export';
import ProductFeedSettingsAttributeMapping from './settings/attribute-mapping/attribute-mapping';
import ProductFeedSettingsSummary from './settings/summary/summary';

export default {
  name: 'ProductFeedSettings',
  components: {
    Stepper,
    ProductFeedSettingsShipping,
    ProductFeedSettingsExport,
    ProductFeedSettingsAttributeMapping,
    ProductFeedSettingsSummary,
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
          title: this.$i18n.t('productFeedSettings.steps.summary'),
        },
      ],
    };
  },
  computed: {
    activeStep() {
      return this.$store.state.productFeed.stepper;
    },
  },
  methods: {
    productFeedCancelProcess() {
      this.$emit('cancelProductFeedProcess');
    },
  },
};
</script>
