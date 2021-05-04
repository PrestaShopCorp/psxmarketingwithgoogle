<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled' : !isEnabled }"
  >
    <div
      class="d-md-flex flex-wrap align-items-center justify-content-between mb-3"
    >
      <div class="d-flex align-items-center">
        <img
          class="mr-3"
          :src="isEnabled
            ? require('@/assets/images/product-feed-icon.svg')
            : require('@/assets/images/product-feed-icon-grey.svg')"
          width="40"
          height="40"
          alt=""
        >
        <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
          {{ $t('productFeedCard.title') }}
        </b-card-text>
      </div>
    </div>
    <p class="ps_gs-fz-12">
      {{ $t('productFeedCard.intro') }}
    </p>
    <div
      v-if="!isEnabled"
      class="d-flex mt-2"
    >
      <span
        class="mr-2"
      >
        <b-icon-exclamation-circle />
      </span>
      <ul class="list-inline mb-0">
        <li
          class="list-inline-item"
          v-b-tooltip.hover
          title="Tooltip directive content"
        >
          <b-badge variant="muted">
            {{ $t('badge.mca') }}
          </b-badge>
        </li>
        <li
          class="list-inline-item"
          v-b-tooltip.hover
          title="Tooltip directive content"
        >
          <b-badge variant="muted">
            {{ $t('badge.productFeedSettings') }}
          </b-badge>
        </li>
      </ul>
    </div>
    <div v-if="isEnabled && toConfigure">
      <p>
        Submitting your product data to Google in the correct format is important for creating successful ads and free listings for your products. We use this data to make sure that it's matched to the right queries.<br>
        <a class="ps_gs-fz-12 text-muted" href="//google.com" target="_blank">Lear more about product configuration</a>
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
        >
          {{ $t('cta.configureAndExportProductFeed') }}
        </b-button>
      </div>
    </div>
    <div v-if="isEnabled && !toConfigure">
      <b-alert
        variant="success"
        show
      >
        You are successfully opted in. Once your products are approved, they can appear in Shopping tab search results.
      </b-alert>
      <div class="d-flex justify-content-between align-items-center">
        <p class="font-weight-600">
          210 products synced today at 02:00
        </p>
        <b-button variant="invisible">
          View sync status
        </b-button>
      </div>
      <p class="ps_gs-fz-12 text-muted">
        Next sync: 06/12/21 02:00
      </p>
      <div class="d-flex">
        <div class="border px-3 py-2">
          <b-badge
            class="ml-n1 mt-n1"
            variant="success"
          >
            Ready-to-sync
          </b-badge>
          <span class="d-block">
            210
          </span>
        </div>
        <div class="border px-3 py-2">
          <b-badge
            class="ml-n1 mt-n1"
            variant="warning"
          >
            Can’t be synced
          </b-badge>
          <span class="d-block">
            8
          </span>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import {
  BIconExclamationCircle,
} from 'bootstrap-vue';
import Stepper from '../commons/stepper';

export default {
  name: 'ProductFeedCard',
  components: {
    BIconExclamationCircle,
    Stepper,
  },
  data() {
    return {
      steps: [
        {
          title: this.$i18n.t('productFeedSettings.steps.shippingSettings'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.exportRules'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.attributeMapping'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.categoryMapping'),
        },
        {
          title: 'Export feed!'
        },
      ],
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    toConfigure: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
