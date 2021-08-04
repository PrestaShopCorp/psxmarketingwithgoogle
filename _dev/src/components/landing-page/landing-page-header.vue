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
        class="ps_gs-landingpage-header__title d-flex mr-3"
      >
        <img
          src="@/assets/images/temp_target.svg"
          width="48"
          height="48"
          class="img-fluid mr-3"
          alt=""
        >
        <span
          style="color:#8e95a1; font-weight:600; font-size:1.5rem"
          class="d-flex align-items-center flex-wrap"
        >
          <span
            style="color:#27206b;"
            class="mr-2"
          >PrestaShop</span> <span>Marketing with Google</span>
        </span>
        <span class="sr-only">{{ $t('landingPage.header.title') }}</span>
      </h2>
      <p class="ps_gs-landingpage-header__text w-100">
        {{ $t('landingPage.header.text') }}
      </p>
      <b-button
        size="sm"
        variant="primary"
        class="my-2"
        @click="hideLandingPage"
        data-test-id="lp-header-cta"
      >
        {{ $t('cta.startConfiguring') }}
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
import {VueShowdown} from 'vue-showdown';

export default {
  name: 'LandingPageHeader',
  components: {
    VueShowdown,
  },
  data() {
    return {
    };
  },
  methods: {
    hideLandingPage() {
      this.$root.$emit('onHideLanding');
    },
  },
};
</script>
