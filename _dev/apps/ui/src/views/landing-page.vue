<template>
  <b-card no-body>
    <div class="ps_gs-landingpage">
      <LandingPageHeader @hideLandingPage="hideLandingPage('header')" />
      <hr class="my-4">
      <LandingPageContent
        :svg-image="false"
        content-image=""
        :content-title="$t('landingPage.content.content1.title')"
        :content-text="$t('landingPage.content.content1.text')"
      >
        <img
          src="@/assets/images/Merchant-Center-img.png"
          class="img-fluid d-block mx-auto"
          alt=""
          width="250"
          height="175"
        >
      </LandingPageContent>
      <LandingPageContent
        :content-title="$t('landingPage.content.content2.title')"
        :content-text="$t('landingPage.content.content2.text')"
        :content-footer="$t('landingPage.content.content2.footer', [
          $options.googleUrl.createNewMerchantCenter,
          $options.googleUrl.eligibilityRequirements
        ])"
      >
        <img
          src="@/assets/images/Google-Shopping-Tab-img.png"
          class="img-fluid d-block mx-auto"
          alt=""
          width="250"
          height="175"
        >
      </LandingPageContent>
      <LandingPageContent
        :content-title="$t('landingPage.content.content3.title')"
        :content-text="$t('landingPage.content.content3.text')"
      >
        <img
          src="@/assets/images/Google-Commercial-img.png"
          class="img-fluid d-block mx-auto"
          alt=""
          width="250"
          height="175"
        >
      </LandingPageContent>
      <LandingPageContent
        :content-title="$t('banner.titleAdsbanner')"
        :content-text="$t('banner.textAdsBanner', [priceForAds])"
        :content-footer="$t('banner.legendLong', [
          $options.googleUrl.googleAdsTermsAndCondition
        ])"
      >
        <img
          :src="pathToAdsPromotionImage"
          alt=""
          width="250"
          height="175"
        >
      </LandingPageContent>
      <hr class="my-4">
      <LandingPageFooter @hideLandingPage="hideLandingPage('footer')" />
    </div>
  </b-card>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';

import LandingPageHeader from '../components/landing-page/landing-page-header';
import LandingPageContent from '../components/landing-page/landing-page-content';
import LandingPageFooter from '../components/landing-page/landing-page-footer';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {getPathToAdsPromotionImage} from '@/utils/ImageFromCurrency';
import {searchPrice} from '@/utils/PriceFromCurrency';

export default {
  name: 'LandingPage',
  components: {
    LandingPageHeader,
    LandingPageContent,
    LandingPageFooter,
  },
  methods: {
    hideLandingPage(where) {
      localStorage.setItem('landingHasBeenSeen', true);
      this.$router.push({
        name: 'configuration',
      });
      this.$segment.track(`[GGL] Start Configuration - ${where} clicked`, {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
  },
  computed: {
    pathToAdsPromotionImage() {
      return getPathToAdsPromotionImage(this.$store.state.app.psxMktgWithGoogleShopCurrency.isoCode);
    },
    priceForAds() {
      return searchPrice(this.$store.state.app.psxMktgWithGoogleShopCurrency.isoCode);
    },

  },
  googleUrl,
};
</script>
