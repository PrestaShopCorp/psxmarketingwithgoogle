<!-- NOTHING DONE YET -->
<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled' : !isEnabled }"
  >
    <div
      class="d-flex align-items-center"
    >
      <img
        class="mr-3 rounded-circle"
        src="@/assets/images/Google-Ads-icon-grey.svg"
        width="40"
        height="40"
        alt=""
        >
      <b-card-text class="text-left mb-0 ps_gs-fz-12">
        {{ $t('googleAdsAccountCard.introDisabled') }}
      </b-card-text>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'GoogleAdsAccountCard',
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
