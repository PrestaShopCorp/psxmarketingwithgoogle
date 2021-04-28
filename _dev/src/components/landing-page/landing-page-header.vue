<template>
  <header class="ps_gs-landingpage-header d-flex flex-column flex-md-row">
    <figure class="ps_gs-landingpage-header__figure order-md-2 flex-shrink-0 ml-md-3">
      <img
        src="@/assets/images/prestashop-google-img.png"
        width="276"
        height="178"
        class="img-fluid mx-auto d-block"
        alt=""
      >
    </figure>
    <div>
      <h2
        class="ps_gs-landingpage-header__title"
      >
        <img
          src="@/assets/images/prestashop-google-logo.png"
          class="img-fluid mr-md-3"
          alt=""
        >
        <span class="sr-only">{{ $t('landingPage.header.title') }}</span>
      </h2>
      <p class="ps_gs-landingpage-header__text w-100">
        {{ $t('landingPage.header.text') }}
      </p>
      <b-button
        size="sm"
        variant="primary"
        class="my-2"
      >
        {{ $t('cta.getStarted') }}
      </b-button>

      <div class="ps_gs-landingpage-header__benefits text-muted">
        <VueShowdown
          :markdown="$t('landingPage.header.reinsurance')"
        />
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'LandingPageHeader',
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
