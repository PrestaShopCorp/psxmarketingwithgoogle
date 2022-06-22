<template>
  <div>
    <b-card
      no-body
      class="mb-4"
    >
      <div class="ps_gs-landingpage">
        <LandingPageHeader @hideLandingPage="hideLandingPage('header')" />
        <hr class="my-4">
        <LandingPageContent
          :svg-image="false"
          content-image="Merchant-Center-img.png"
          :content-title="$t('landingPage.content.content1.title')"
          :content-text="$t('landingPage.content.content1.text')"
        />
        <LandingPageContent
          :svg-image="false"
          content-image="Google-Shopping-Tab-img.png"
          :content-title="$t('landingPage.content.content2.title')"
          :content-text="$t('landingPage.content.content2.text')"
          :content-footer="$t('landingPage.content.content2.footer', [
            $options.googleUrl.createNewMerchantCenter,
            $options.googleUrl.eligibilityRequirements
          ])"
        />
        <LandingPageContent
          :svg-image="false"
          content-image="Google-Commercial-img.png"
          :content-title="$t('landingPage.content.content3.title')"
          :content-text="$t('landingPage.content.content3.text')"
        />
        <LandingPageContent
          :svg-image="true"
          :content-image="pngBanner"
          :content-title="$t('banner.titleAdsbanner')"
          :content-text="$t('banner.textAdsBanner', [priceForAds])"
          :content-footer="$t('banner.legendLong', [
            $options.googleUrl.googleAdsTermsAndCondition
          ])"
        />
        <hr class="my-4">
        <LandingPageFooter @hideLandingPage="hideLandingPage('footer')" />
      </div>
    </b-card>
    <p class="ps_gs-landingpage-content__muted text-muted text-center">
      {{ $t('landingPage.footer.legal') }}
    </p>
  </div>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';

import LandingPageHeader from '../components/landing-page/landing-page-header';
import LandingPageContent from '../components/landing-page/landing-page-content';
import LandingPageFooter from '../components/landing-page/landing-page-footer';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {searchImage} from '@/utils/ImageFromCurrency';
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
    pngBanner() {
      return searchImage(this.$store.state.app.psxMktgWithGoogleShopCurrency.isoCode);
    },
    priceForAds() {
      return searchPrice(this.$store.state.app.psxMktgWithGoogleShopCurrency.isoCode);
    },

  },
  googleUrl,
};
</script>
