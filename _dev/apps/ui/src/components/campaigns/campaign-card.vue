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
          <div class="d-flex align-items-start align-items-md-center">
            <img
              class="mr-2"
              src="@/assets/images/boost-campaing.svg"
              width="32"
              height="32"
              alt=""
            >
            <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
              {{ $t('smartShoppingCampaignCard.title') }}
            </b-card-text>
          </div>
        </div>

        <div class="ml-2 ps_gs-onboardingcard__content">
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
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script>
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'CampaignCard',
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
  methods: {
    openPopinActivateTracking() {
      this.$segment.track('[GGL] Create SSC Config tab', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });

      this.$emit('openPopin');
    },
  },
};
</script>
