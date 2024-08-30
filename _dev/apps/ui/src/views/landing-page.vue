<template>
  <div class="container-md">
    <monetization-messages>
      <template #content-modale>
        {{ $t('monetization.popinUpdateLandingPageText') }}
      </template>
    </monetization-messages>

    <b-card no-body>
      <div class="ps_gs-landingpage">
        <LandingPageHeader @hideLandingPage="hideLandingPage('header')" />
        <hr>
        <LandingPageContent
          :svg-image="false"
          content-image=""
          :content-title="$t('landingPage.content.content1.title')"
          :content-text="$t('landingPage.content.content1.text')"
          background-color="bg-amber-100"
        >
          <img
            src="@/assets/images/120x120_MARKETING_BACK-OFFICE_01.png"
            alt=""
            width="80"
            height="80"
          >
        </LandingPageContent>
        <LandingPageContent
          :content-title="$t('landingPage.content.content2.title')"
          :content-text="$t('landingPage.content.content2.text')"
          :content-footer="$t('landingPage.content.content2.footer', [
            $options.googleUrl.createNewMerchantCenter,
            $options.googleUrl.eligibilityRequirements
          ])"
          background-color="bg-ocean-blue-50"
        >
          <img
            src="@/assets/images/120x120_MARKETING_BACK-OFFICE_02.png"
            class="img-fluid d-block mx-auto"
            alt=""
            width="80"
            height="80"
          >
        </LandingPageContent>
        <LandingPageContent
          :content-title="$t('landingPage.content.content3.title')"
          :content-text="$t('landingPage.content.content3.text')"
          background-color="bg-green-50"
        >
          <img
            src="@/assets/images/120x120_MARKETING_BACK-OFFICE_03.png"
            class="img-fluid d-block mx-auto"
            alt=""
            width="80"
            height="80"
          >
        </LandingPageContent>
        <LandingPageContent
          :content-title="$t('banner.titleAdsbanner')"
          :content-text="$t('banner.textAdsBanner', [priceForAds])"
          :content-footer="$t('banner.legendLong', [
            $options.googleUrl.googleAdsTermsAndCondition
          ])"
          background-color="bg-red-50"
        >
          <img
            :src="pathToAdsPromotionImage"
            class="img-fluid d-block mx-auto"
            alt=""
            width="80"
            height="80"
          >
        </LandingPageContent>
        <hr>
        <LandingPageFooter @hideLandingPage="hideLandingPage('footer')" />
      </div>
    </b-card>
  </div>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';

import LandingPageHeader from '@/components/landing-page/landing-page-header';
import LandingPageContent from '@/components/landing-page/landing-page-content';
import LandingPageFooter from '@/components/landing-page/landing-page-footer';
import MonetizationMessages from '@/components/monetization/monetization-messages.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {getPathToAdsPromotionImage} from '@/utils/ImageFromCurrency';
import {searchPrice} from '@/utils/PriceFromCurrency';

export default {
  name: 'LandingPage',
  components: {
    LandingPageHeader,
    LandingPageContent,
    LandingPageFooter,
    MonetizationMessages,
  },
  methods: {
    hideLandingPage(where) {
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
      return getPathToAdsPromotionImage(
        this.$store.state.app.psxMktgWithGoogleShopCurrency.isoCode,
      );
    },
    priceForAds() {
      return searchPrice(this.$store.state.app.psxMktgWithGoogleShopCurrency.isoCode);
    },

  },
  googleUrl,
};
</script>
