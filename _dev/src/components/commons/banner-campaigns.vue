<template>
  <b-card class="shadow-sm border-0 mb-3">
    <b-card-body>
      <div class="d-flex align-items-center">
        <img
          src="@/assets/images/Google-Commercial-icon.svg"
          width="75"
          height="75"
          alt=""
        >
        <span class="mr-3 ml-3">
          <h3 class="font-weight-600">
            {{ $t("banner.titleCampaignsBanner") }}
          </h3>

          <p>
            {{ $t("banner.textCampaignsBanner") }}
          </p>

        </span>

        <b-button
          class="flex-shrink-0"
          :to="{name: 'campaign-creation'}"
          variant="primary"
        >
          {{ $t('banner.ctaCreateFirstCampaign') }}
        </b-button>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
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
};
</script>
