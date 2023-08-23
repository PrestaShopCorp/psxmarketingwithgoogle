<template>
  <b-card class="shadow-sm border-0 mb-3">
    <b-card-body class="p-1">
      <div class="d-flex flex-column flex-md-row align-items-center">
        <img
          src="@/assets/images/Google-Ads-PS-Style.svg"
          width="75"
          height="75"
          alt=""
        >
        <div class="mr-3 ml-3">
          <h3 class="font-weight-600">
            {{ $t("smartShoppingCampaignCard.title") }}
          </h3>

          <p class="mb-1 mb-md-0">
            {{ $t("banner.textCampaignsBanner") }}
          </p>
        </div>

        <b-button
          class="flex-shrink-0 ml-5"
          variant="primary"
          @click="$emit('clickToCreateCampaign')"
        >
          {{ this.accountHasAtLeastOneCampaign
            ? $t('cta.launchCampaign') : $t('banner.ctaCreateFirstCampaign')
          }}
        </b-button>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'BannerCampaigns',
  data() {
    return {
      isConfigured: true,
    };
  },
  computed: {
    accountHasAtLeastOneCampaign() {
      return !!this.$store.getters['campaigns/GET_ALL_CAMPAIGNS']?.length;
    },
  },
};
</script>
