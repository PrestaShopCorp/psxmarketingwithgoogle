<template>
  <b-card no-body>
    <div class="ps_gs-landingpage">
      <LandingPageHeader @hideLandingPage="hideLandingPage" />
      <hr class="my-4">
      <LandingPageContent
        content-image="Merchant-Center-img.png"
        :content-title="$t('landingPage.content.content1.title')"
        :content-text="$t('landingPage.content.content1.text')"
        :content-footer="$t('landingPage.content.content1.footer', [
          $options.googleUrl.learnAboutFreeListing
        ])"
      />
      <LandingPageContent
        content-image="Google-Shopping-Tab-img.png"
        :content-title="$t('landingPage.content.content2.title')"
        :content-text="$t('landingPage.content.content2.text')"
        :content-footer="$t('landingPage.content.content2.footer', [
          $options.googleUrl.createNewMerchantCenter,
          $options.googleUrl.eligibilityRequirements
        ])"
      />
      <LandingPageContent
        content-image="Google-Commercial-img.png"
        :content-title="$t('landingPage.content.content3.title')"
        :content-text="$t('landingPage.content.content3.text')"
        :content-footer="$t('landingPage.content.content3.footer', [
          $options.googleUrl.learnAboutSmartShoppingCampaigns
        ])"
      />
      <VueShowdown
        :markdown="$t('landingPage.content.notice')"
        class="text-muted ps_gs-fz-12 mt-2 mt-md-4 pb-1"
      />
      <hr class="my-4">
      <LandingPageFooter @hideLandingPage="hideLandingPage" />
    </div>
  </b-card>
</template>

<script>
import {VueShowdown} from 'vue-showdown';
import googleUrl from '@/assets/json/googleUrl.json';

import LandingPageHeader from '../components/landing-page/landing-page-header';
import LandingPageContent from '../components/landing-page/landing-page-content';
import LandingPageFooter from '../components/landing-page/landing-page-footer';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'LandingPage',
  components: {
    VueShowdown,
    LandingPageHeader,
    LandingPageContent,
    LandingPageFooter,
  },
  methods: {
    hideLandingPage() {
      this.$router.push({
        name: 'configuration',
      });
      localStorage.setItem('landingHasBeenSeen', true);
      this.$segment.track('[GGL] Start Configuration', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
  },
  googleUrl,
};
</script>
