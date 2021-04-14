<template>
  <div>
    <section-title
      :stepNumber="1"
      stepTitle="Your PrestaShop account"
      :isEnabled="true"
      :isDone="false"
    />
    <ps-account-card
      :isConnected="false"
    />
    <section-title
      :stepNumber="2"
      stepTitle="Activate your free product listings"
      :isEnabled="false"
      :isDone="false"
    />
    <google-account-card
      :isEnabled="false"
      :isConnected="false"
    />
    <section-title
      :stepNumber="3"
      stepTitle="Launch your paid Smart Shopping campaign"
      :isEnabled="false"
      :isDone="false"
    />
    <google-ads-account-card
      :isEnabled="false"
      :isConnected="false"
    />
  </div>
</template>

<script>
import SectionTitle from '../components/onboarding/section-title'
import PsAccountCard from '../components/onboarding/ps-account-card'
import GoogleAccountCard from '../components/onboarding/google-account-card'
import GoogleAdsAccountCard from '../components/onboarding/google-ads-account-card'

export default {
  name: 'OnboardingPage',
  components: {
    SectionTitle, PsAccountCard, GoogleAccountCard, GoogleAdsAccountCard,
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="">
</style>
