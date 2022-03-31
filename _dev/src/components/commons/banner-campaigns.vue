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
        <div class="mr-3 ml-3">
          <h3 class="font-weight-600">
            {{ $t("banner.titleCampaignsBanner") }}
          </h3>

          <p>
            {{ $t("banner.textCampaignsBanner") }}
          </p>
        </div>

        <b-button
          class="flex-shrink-0"
          :to="{name: 'campaign-creation'}"
          variant="primary"
          @click="segmentEvent"
        >
          {{ $t('banner.ctaCreateFirstCampaign') }}
        </b-button>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import {searchImage} from '@/utils/ImageFromCurrency';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  data() {
    return {
      isConfigured: true,
    };
  },
  computed: {
    pngBanner() {
      return searchImage(this.$store.state.app.psxMktgWithGoogleShopCurrency.isoCode);
    },
  },
  methods: {
    segmentEvent() {
      this.$segment.track('[GGL] Click on Create your first campaign - Campaign tab', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
  },
};
</script>
