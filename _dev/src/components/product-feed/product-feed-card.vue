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
    <div class="d-md-flex justify-content-between">
      <p class="ps_gs-fz-12">
        {{ $t('productFeedCard.introDisabled') }}
      </p>
      <div
        class="text-center"
        v-if="isEnabled"
      >
        <b-button
          size="sm"
          variant="primary"
          class="ml-md-3"
        >
          {{ $t('cta.configureAndExportProductFeed') }}
        </b-button>
      </div>
    </div>
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
  </b-card>
</template>

<script>
import {
  BIconExclamationCircle,
} from 'bootstrap-vue';

export default {
  name: 'ProductFeedCard',
  components: {
    BIconExclamationCircle,
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
