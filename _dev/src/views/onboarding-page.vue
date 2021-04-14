<template>
  <div>
    <section-title
      :step-number="1"
      step-title="Your PrestaShop account"
      :is-enabled="true"
      :is-done="false"
    />
    <ps-account-card
      :is-connected="false"
    />
    <section-title
      :step-number="2"
      step-title="Activate your free product listings"
      :is-enabled="false"
      :is-done="false"
    />
    <google-account-card
      :is-enabled="false"
      :is-connected="false"
    />
    <section-title
      :step-number="3"
      step-title="Launch your paid Smart Shopping campaign"
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
