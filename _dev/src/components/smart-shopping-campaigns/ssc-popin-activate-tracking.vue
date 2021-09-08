<template>
  <ps-modal
    id="SSCPopinActivateTracking"
    ref="modal"
    :title="$t('modal.titleActivateTrackingSSC')"
    v-bind="$attrs"
    @ok="changeTrackingStatus"
  >
    <!-- TODO  : missing links -->
    <VueShowdown
      class="my-1"
      :extensions="['extended-link']"
      :markdown="$t('modal.textActivateTrackingSSC', ['http://google.fr', 'http://google.fr'])"
    />
    <b-form-checkbox
      switch
      size="lg"
      class="mt-3 ps_gs-switch"
      v-model="trackingStatus"
      data-test-id="checkbox-sellRefurbished"
    >
      <span class="ps_gs-fz-14">
        {{ $t('smartShoppingCampaignCreation.toggleCreationRemarketingTag') }}
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
          :extensions="['no-p-tag', 'extended-link']"
        />
      </div>
    </b-alert>
    <template
      slot="modal-cancel"
    >
      {{ $t("cta.cancel") }}
    </template>
    <template slot="modal-ok">
      {{ $t("cta.continue") }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';

export default {
  name: 'SSCPopinActivateTracking',
  components: {
    PsModal,
  },

  computed: {
    tagAlreadyExists() {
      return this.$store.state.smartShoppingCampaigns.tagAlreadyExists;
    },
    trackingStatus: {
      get() {
        return this.$store.state.smartShoppingCampaigns.tracking;
      },
      set(value) {
        this.$store.dispatch('smartShoppingCampaigns/SAVE_STATUS_REMARKETING_TRACKING_TAG', value);
      },
    },
    alertTag() {
      if (this.trackingStatus === false) {
        return {
          text: this.$i18n.t('smartShoppingCampaignCreation.alerts.noTag'),
        };
      }
      if (this.trackingStatus === true && this.tagAlreadyExists) {
        return {
          text: this.$i18n.t('smartShoppingCampaignCreation.alerts.duplicatedTag'),
        };
      }
      return null;
    },
  },
  methods: {
    changeTrackingStatus() {
      this.$router.push({
        name: 'campaign-creation',
      });
    },
  },
};
</script>
