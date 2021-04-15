<template>
  <div>
    <section-title
      :step-number="1"
      :step-title="$t('onboarding.sectionTitle.psAccount')"
      :is-enabled="true"
      :is-done="false"
    />
    <ps-account-card
      :is-connected="false"
    />
    <section-title
      :step-number="2"
      :step-title="$t('onboarding.sectionTitle.freeListing')"
      :is-enabled="false"
      :is-done="false"
    />
    <google-account-card
      :is-enabled="false"
      :is-connected="false"
    />
    <section-title
      :step-number="3"
      :step-title="$t('onboarding.sectionTitle.smartShoppingCampaign')"
      :is-enabled="false"
      :is-done="false"
    />
    <google-ads-account-card
      :is-enabled="false"
      :is-connected="false"
    />
  </div>
</template>

<script>
import SectionTitle from '../components/onboarding/section-title';
import PsAccountCard from '../components/onboarding/ps-account-card';
import GoogleAccountCard from '../components/onboarding/google-account-card';
import GoogleAdsAccountCard from '../components/onboarding/google-ads-account-card';

export default {
  name: 'OnboardingPage',
  components: {
    SectionTitle, PsAccountCard, GoogleAccountCard, GoogleAdsAccountCard,
  },
};
</script>

<style lang="">
</style>
