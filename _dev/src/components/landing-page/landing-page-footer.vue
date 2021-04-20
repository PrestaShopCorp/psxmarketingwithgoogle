<template>
  <footer class="ps_gs-landingpage-footer text-center">
    <b-row class="flex-column flex-sm-row">
      <b-col>
        <p class="ps_gs-landingpage-footer__text mb-3">
          {{ $t('landingPage.footer.text') }}
        </p>
        <b-button variant="primary">
          {{ $t('cta.getStarted') }}
        </b-button>
      </b-col>
    </b-row>
  </footer>
</template>

<script>

export default {
  name: 'LandingPageFooter',
  data() {
    return {
    };
  },
};
</script>
