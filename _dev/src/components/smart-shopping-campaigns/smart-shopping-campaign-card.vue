<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled' : !isEnabled }"
  >
    <div
      class="d-md-flex flex-wrap align-items-center justify-content-between mb-3"
    >
      <div class="d-flex align-items-center">
        <img
          class="mr-3"
          :src="isEnabled
            ? require('@/assets/images/Google-Commercial-icon.svg')
            : require('@/assets/images/Google-Commercial-icon-grey.svg')"
          width="40"
          height="40"
          alt=""
        >
        <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
          {{ $t('smartShoppingCampaignCard.title') }}
        </b-card-text>
      </div>
    </div>

    <div class="d-flex flex-wrap flex-md-nowrap justify-content-between mt-3">
      <VueShowdown
        tag="p"
        :markdown="$t('smartShoppingCampaignCard.intro')"
        :class="isEnabled ? 'mb-0' : 'mb-1'"
        :extensions="['no-p-tag']"
      />
      <div
        v-if="isEnabled"
        class="flex-grow-1 d-flex-md flex-md-grow-0 flex-shrink-0 text-center align-self-end"
      >
        <b-button
          @click="openPopinActivateTracking"
          size="sm"
          variant="primary"
          class="mx-1 mt-3 mt-md-0 mr-md-0 ml-md-3"
          data-test-id="btn-create-campaign"
        >
          {{ $t('cta.createCampaign') }}
        </b-button>
      </div>
    </div>
    <template v-if="isEnabled && statusTrackingTag !== null && SSCExist">
      <hr>
      <b-form-checkbox
        switch
        size="lg"
        class="ps_gs-switch"
        v-model="statusTrackingTag"
        @change="changeStatus"
      >
        <span class="ps_gs-fz-14">
          {{ toggleTag }}
        </span>
      </b-form-checkbox>
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
        </div>
      </b-alert>
    </template>
    <BadgeListRequirements
      v-if="!isEnabled"
      :badges="['productFeed', 'googleAdsAccount']"
    />
  </b-card>
</template>

<script>
import BadgeListRequirements from '../commons/badge-list-requirements';

export default {
  name: 'SmartShoppingCampaignCard',
  components: {
    BadgeListRequirements,
  },
  data() {
    return {
      selected: null,

    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    alertTag() {
      if (this.statusTrackingTag === false) {
        return {
          text: this.$i18n.t('smartShoppingCampaignCreation.alerts.noTag'),
        };
      }
      return null;
    },
    statusTrackingTag() {
      return this.$store.state.smartShoppingCampaigns.tracking;
    },
    toggleTag() {
      if (this.statusTrackingTag === false) {
        return this.$i18n.t('smartShoppingCampaignCreation.toggleCreationRemarketingTag');
      }
      return this.$i18n.t('smartShoppingCampaignCreation.enableCreationRemarketingTag');
    },
    SSCExist() {
      //  TODO return if a SSC already exists to display toggle tag
      return false;
    },
  },
  methods: {
    openPopinActivateTracking() {
      // Prevent popin for opening if tracking is already activated
      if (this.statusTrackingTag !== true) {
        this.$emit('openPopin');
      } else {
        this.$router.push({
          name: 'campaign-creation',
        });
      }
    },
    changeStatus() {
      this.$store.dispatch(
        'smartShoppingCampaigns/SAVE_STATUS_REMARKETING_TRACKING_TAG', this.statusTrackingTag,
      );
    },
  },
};
</script>
