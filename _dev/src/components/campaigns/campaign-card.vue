<template>
  <section v-if="isEnabled">
    <b-skeleton-wrapper
      :loading="loading"
      class="mb-3"
    >
      <template #loading>
        <b-card>
          <b-skeleton width="85%" />
          <b-skeleton width="55%" />
          <b-skeleton width="70%" />
        </b-card>
      </template>
      <b-card
        no-body
        class="ps_gs-onboardingcard p-3"
      >
        <div
          class="d-md-flex flex-wrap align-items-center justify-content-between mb-3"
        >
          <div class="d-flex align-items-center">
            <img
              class="mr-3"
              :src="require('@/assets/images/boost-campaing.svg')"
              width="40"
              height="40"
              alt=""
            >
            <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
              {{ $t('smartShoppingCampaignCard.title') }}
            </b-card-text>
          </div>
        </div>

        <div class="base-ads-card-text">
          <VueShowdown
            tag="p"
            :markdown="$t('smartShoppingCampaignCard.introConnected')"
            class="mb-0"
            :extensions="['no-p-tag']"
          />
          <div
            class="mt-3"
          >
          <b-button
            @click="openPopinActivateTracking"
            size="sm"
            variant="primary"
            data-test-id="btn-create-campaign"
          >
            {{ $t('cta.launchCampaign') }}
          </b-button>
        </div>
      </div>

        <VueShowdown
          tag="p"
          :markdown="$t('smartShoppingCampaignCard.footer')"
          :class="isEnabled ? 'mb-0' : 'mb-1'"
          class="ps_gs-fz-12 mt-2"
          :extensions="['no-p-tag']"
        />
        <span v-if="isEnabled">
          <hr>
          <CampaignTracking
          />
        </span>
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script>
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import CampaignTracking from './campaign-tracking.vue';

export default {
  name: 'CampaignCard',
  components: {
    CampaignTracking,
  },
  data() {
    return {
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    accountHasAtLeastOneCampaign() {
      return !!this.$store.getters['campaigns/GET_ALL_CAMPAIGNS']?.length;
    },
    getRemarketingTag() {
      return this.$store.getters['campaigns/GET_REMARKETING_TRACKING_TAG_IS_SET'];
    },
  },
  methods: {
    openPopinActivateTracking() {
      this.$segment.track('[GGL] Create SSC Config tab', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      // Prevent popin for opening if tracking is a campaign exists
      if (this.accountHasAtLeastOneCampaign) {
        this.$router.push({
          name: 'campaign-creation',
        });
      } else {
        this.$emit('openPopin');
      }
    },
  },
};
</script>
