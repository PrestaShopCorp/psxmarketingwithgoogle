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
    <BadgeListRequirements
      v-if="!isEnabled"
      :badges="['productFeed', 'googleAdsAccount']"
    />
  </b-card>
</template>

<script>
import {
  BIconExclamationCircle,
} from 'bootstrap-vue';
import BadgeListRequirements from '../commons/badge-list-requirements';

export default {
  name: 'SmartShoppingCampaignCard',
  components: {
    BIconExclamationCircle,
    BadgeListRequirements,
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
