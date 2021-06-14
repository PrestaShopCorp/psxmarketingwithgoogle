<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard ps_gs-onboardingcard--muted p-3"
  >
    <p class="mb-1 px-2">
      {{ $t('onboarding.productFeedNotice') }}
    </p>
    <a
      target="_blank"
      class="text-muted ps_gs-fz-12 px-2"
    >
      {{ $t('cta.learnMoreAboutSmartShoppingCampaigns') }}
    </a>
  </b-card>
</template>

<script>
export default {
  name: 'ProductFeedNotice',
};
</script>
