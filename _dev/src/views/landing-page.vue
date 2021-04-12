<template>
  <b-card no-body>
    <div class="ps_gs-landingpage">
      <LandingPageHeader />
      <hr class="my-4">
      <LandingPageContent />
      <LandingPageContent />
      <LandingPageContent />
      <hr class="my-4">
      <LandingPageFooter />
    </div>
  </b-card>
</template>

<script>
import LandingPageHeader from '../components/landing-page/landing-page-header'
import LandingPageContent from '../components/landing-page/landing-page-content'
import LandingPageFooter from '../components/landing-page/landing-page-footer'

export default {
  name: 'LandingPage',
  components: { LandingPageHeader, LandingPageContent, LandingPageFooter },
  data: function(){
    return {
      // landingPageContentItems : [
      //   {
      //     img: 'https://via.placeholder.com/240x163',
      //     title: $t(""),
      //     text: $t(""),
      //     footer: $t(""),
      //   },
      //   {
      //     img: 'https://via.placeholder.com/240x163',
      //     title: $t(""),
      //     text: $t(""),
      //     footer: $t(""),
      //   },
      //   {
      //     img: 'https://via.placeholder.com/240x163',
      //     title: $t(""),
      //     text: $t(""),
      //     footer: $t(""),
      //   },
      // ],
    }
  },
}
</script>

<style lang="">
</style>
