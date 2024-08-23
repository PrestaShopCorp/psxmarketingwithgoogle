<template>
  <div
    class="ps_gs-landingpage-content d-flex flex-column flex-md-row"
  >
    <figure
      class="ps_gs-landingpage-content__figure flex-shrink-0 mr-md-4 mb-md-0"
      :class="backgroundColor"
    >
      <slot />
    </figure>
    <div class="text-center text-md-left">
      <h3 class="mb-2">
        {{ contentTitle }}
      </h3>
      <VueShowdown
        :markdown="contentText"
      />
      <div
        class="ps_gs-fz-12 text-muted"
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
      default: null,
    },
    backgroundColor: {
      type: String,
      default: null,
    },
  },
};
</script>
