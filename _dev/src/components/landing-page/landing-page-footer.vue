<template>
  <footer class="ps_gs-landingpage-footer text-center">
    <b-row class="flex-column flex-sm-row">
      <b-col>
        <p class="ps_gs-landingpage-footer__text mb-3">
          {{ $t("landingPage.footer.text") }}
        </p>
        <b-button
          size="lg"
          variant="primary"
          @click="$emit('hideLandingPage')"
          data-test-id="lp-footer-cta"
        >
          {{ $t("cta.startConfiguring") }}
        </b-button>
      </b-col>
    </b-row>
  </footer>
</template>

<script>

export default {
  name: 'LandingPageFooter',
};
</script>
