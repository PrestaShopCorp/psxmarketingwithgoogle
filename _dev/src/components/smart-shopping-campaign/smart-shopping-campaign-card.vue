<!-- NOTHING DONE YET -->
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
            ? require('@/assets/images/Google-Ads-icon.svg')
            : require('@/assets/images/Google-Ads-icon-grey.svg')"
          width="40"
          height="40"
          alt=""
        >
        <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
          {{ $t('smartShoppingCampaignCard.title') }}
          <b-badge
            class="ml-3"
            variant="muted"
          >
            {{ $t('badge.paid') }}
          </b-badge>
        </b-card-text>
      </div>
    </div>
    <p
      class="ps_gs-fz-12"
      :class="isEnabled ? 'mb-0' : 'mb-2'"
    >
      {{ $t('smartShoppingCampaignCard.intro') }}
    </p>
    <div
      v-if="!isEnabled"
      class="d-flex mt-3"
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
          <b-badge
            variant="muted"
          >
            {{ $t('badge.productFeed') }}
          </b-badge>
        </li>
        <li
          class="list-inline-item"
          v-b-tooltip.hover
          title="Tooltip directive content"
        >
          <b-badge
            variant="muted"
          >
            {{ $t('badge.googleAdsAccount') }}
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
  name: 'SmartShoppingCampaignCard',
  components: {
    BIconExclamationCircle,
  },
  data() {
    return {
      selected: null,
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
  },
};
</script>
