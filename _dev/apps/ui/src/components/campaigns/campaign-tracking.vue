<template>
  <section>
    <b-card
      no-body
      class="ps_gs-onboardingcard p-3"
    >
      <div
        class="d-md-flex flex-wrap align-items-center justify-content-between mb-3"
      >
        <div class="d-flex align-items-center">
          <img
            class="mr-2"
            src="@/assets/images/local-offer.svg"
            width="32"
            height="32"
            alt=""
          >
          <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
            {{ $t('smartShoppingCampaignCreation.enableCreationRemarketingTag') }}
          </b-card-text>
        </div>
      </div>

      <div class="ml-2 ps_gs-onboardingcard__content">
        <VueShowdown
          tag="p"
          :markdown="$t('smartShoppingCampaignCard.footer')"
          class="mb-0"
          :extensions="['no-p-tag']"
        />
        <b-form-checkbox
          switch
          size="lg"
          class="mt-3 ps_gs-switch"
          v-model="statusTrackingTag"
        >
          <span class="ps_gs-fz-14 text-dark d-block">
            {{ statusTrackingTag ?
              $t('cta.enabled') :
              $t('cta.disabled')
            }}
          </span>
        </b-form-checkbox>
      </div>

      <b-alert
        v-if="alertTag !== null"
        variant="warning"
        show
        class="mb-0 mt-3"
      >
        <div>
          <VueShowdown
            tag="p"
            class="d-inline"
            :markdown="alertTag.text"
            :extensions="['no-p-tag']"
          />
          <div
            v-if="alertTag.button"
            class="mt-2 text-center d-md-flex align-items-center"
          >
            <b-button
              @click="alertTag.button.onclick"
              size="sm"
              variant="primary"
              class="text-wrap btn mx-1 mt-3 mt-md-0
                ml-md-0 mr-md-1 btn-outline-secondary btn-sm"
              data-test-id="btn-create-campaign"
            >
              {{ alertTag.button.cta }}
            </b-button>
          </div>
        </div>
      </b-alert>
    </b-card>
  </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default defineComponent({
  name: 'CampaignCardTracking',
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
    statusTrackingTag: {
      get() {
        return this.$store.getters['campaigns/GET_REMARKETING_TRACKING_TAG_IS_SET'];
      },
      set(value) {
        this.$segment.track('[GGL] Disable Google SSC', {
          module: 'psxmarketingwithgoogle',
          smart_shopping_campaign_activation_value: value,
          params: SegmentGenericParams,
        });
        this.$store.dispatch(
          'campaigns/SAVE_STATUS_REMARKETING_TRACKING_TAG', value,
        ).then(() => {
          if (value === true) {
            this.$emit('remarketingTagHasBeenActivated');
          }
        });
      },
    },
    alertTag() {
      if (this.statusTrackingTag === false) {
        return {
          text: this.$i18n.t('smartShoppingCampaignCreation.alerts.noTag'),
        };
      }
      if (!this.conversionActions.length) {
        return {
          text: this.$i18n.t('smartShoppingCampaignCreation.alerts.noConversionActions'),
          button: {
            cta: this.$i18n.t('smartShoppingCampaignCreation.toggleNewConversionTag'),
            onclick: () => this.$store.dispatch(
              'campaigns/CREATE_REMARKETING_DEFAULT_CONVERSION_ACTIONS',
            ),
          },
        };
      }
      return null;
    },

    toggleTag() {
      if (this.statusTrackingTag === false) {
        return this.$i18n.t('smartShoppingCampaignCreation.toggleCreationRemarketingTag');
      }
      return this.$i18n.t('smartShoppingCampaignCreation.enableCreationRemarketingTag');
    },
    accountHasAtLeastOneCampaign(): boolean {
      return this.$store.getters['campaigns/GET_ACCOUNT_HAS_AT_LEAST_ONE_CAMPAIGN'];
    },
    conversionActions() {
      return this.$store.getters['campaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED'];
    },
  },
  methods: {
  },
});
</script>
