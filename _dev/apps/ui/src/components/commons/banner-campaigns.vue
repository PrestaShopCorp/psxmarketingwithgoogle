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
            {{ $t("smartShoppingCampaignCard.title") }}
          </h3>

          <p>
            {{ $t("banner.textCampaignsBanner") }}
          </p>
        </div>

        <b-button
          class="flex-shrink-0"
          variant="primary"
          @click="openPopinActivateTracking"
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
  data() {
    return {
      isConfigured: true,
    };
  },
  computed: {
    accountHasAtLeastOneCampaign() {
      return !!this.$store.getters['campaigns/GET_ALL_CAMPAIGNS']?.length;
    },
    remarketingTagIsSet() {
      return this.$store.getters['campaigns/GET_REMARKETING_TRACKING_TAG_IS_SET'];
    },
  },
  methods: {
    openPopinActivateTracking() {
      this.$segment.track('[GGL] Click on Create your first campaign - Campaign tab', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      // Prevent popin for opening if tracking is a campaign exists
      if (this.remarketingTagIsSet) {
        this.$router.push({
          name: 'campaign-creation',
        });
      } else {
        this.$emit('openPopinRemarketingTag');
      }
    },
  },
};
</script>
