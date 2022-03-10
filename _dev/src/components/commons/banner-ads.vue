<template>
  <b-card class="shadow-sm border-0 mb-3">
    <button
      v-if="isBanner"
      type="button"
      class="close"
      aria-label="Close"
      @click="closeBanner"
    >
      <span aria-hidden="true">&times;</span>
    </button>
    <b-card-body>
      <div class="d-flex align-items-center">
        <img
          :src="require(`@/assets/images/banner/${pngBanner}`)"
          alt=""
        >
        <span>
          <h3 class="font-weight-600">
            {{ $t("banner.titleAdsbanner") }}
          </h3>

          <p>
            {{ $t("banner.textAdsBanner") }}
          </p>
          <p class="ps_gs-fz-10">
            {{
              isConfigured
                ? $t("banner.legendConfigured")
                : $t("banner.legendNotConfigured")
            }}
          </p>
        </span>

        <img
          src="@/assets/images/banner/dots.png"
          alt=""
          height="70"
        >
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  props: {
    isBanner: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      isConfigured: true,
    };
  },
  computed: {
    pngBanner() {
      if (window.i18nSettings.isoCode.toUpperCase() === 'PL') {
        return 'ads-poland.png';
      }
      if (window.i18nSettings.isoCode.toUpperCase() === 'EN') {
        return 'ads-dollars.png';
      }
      return 'ads-euro.png';
    },
  },
  methods: {
    closeBanner() {
      this.$emit('closeBanner');
    },
  },
};
</script>
