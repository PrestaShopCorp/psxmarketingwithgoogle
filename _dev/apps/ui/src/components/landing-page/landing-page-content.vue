<template>
  <div
    class="ps_gs-landingpage-content d-flex flex-column flex-md-row align-items-center mb-2"
  >
    <figure class="ps_gs-landingpage-content__figure flex-shrink-0 mr-md-3 mb-md-0">
      <slot />
    </figure>
    <div>
      <h3 class="ps_gs-landingpage-content__title mb-3">
        {{ contentTitle }}
      </h3>
      <VueShowdown
        :markdown="contentText"
        class="ps_gs-landingpage-content__text"
      />
      <div
        class="ps_gs-landingpage-content__muted text-muted"
      >
        <VueShowdown
          v-if="contentFooter"
          :markdown="contentFooter"
          :extensions="['extended-link']"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPageContent',
  data() {
    return {
    };
  },
  props: {
    contentTitle: {
      type: String,
      required: true,
    },
    contentText: {
      type: String,
      required: true,
    },
    contentFooter: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>
