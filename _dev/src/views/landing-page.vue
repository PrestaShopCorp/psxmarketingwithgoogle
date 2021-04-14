<template>
  <b-card no-body>
    <div class="ps_gs-landingpage">
      <LandingPageHeader />
      <hr class="my-4">
      <LandingPageContent
        contentImage="Merchant-Center-img.png"
        :contentTitle="$t('landingPage.content.content1.title')"
        :contentText="$t('landingPage.content.content1.text')"
        :contentFooter="$t('landingPage.content.content1.footer')"
      />
      <LandingPageContent
        contentImage="Google-Shopping-Tab-img.png"
        :contentTitle="$t('landingPage.content.content2.title')"
        :contentText="$t('landingPage.content.content2.text')"
        :contentFooter="$t('landingPage.content.content2.footer')"
      />
      <LandingPageContent
        contentImage="Google-Ads-img.png"
        :contentTitle="$t('landingPage.content.content3.title')"
        :contentText="$t('landingPage.content.content3.text')"
        :contentFooter="$t('landingPage.content.content3.footer')"
      />
      <hr class="my-4">
      <LandingPageFooter />
    </div>
  </b-card>
</template>

<script>
import LandingPageHeader from '../components/landing-page/landing-page-header';
import LandingPageContent from '../components/landing-page/landing-page-content';
import LandingPageFooter from '../components/landing-page/landing-page-footer';

export default {
  name: 'LandingPage',
  components: {
    LandingPageHeader, LandingPageContent, LandingPageFooter,
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="">
</style>
