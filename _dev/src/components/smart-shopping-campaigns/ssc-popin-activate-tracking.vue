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
      v-model="statusTrackingTag"
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
          :markdown="alertTag"
          :extensions="['no-p-tag']"
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
  data() {
    return {
      statusTrackingTag: this.$store.state.smartShoppingCampaigns.tracking,
    };
  },

  computed: {
    tagAlreadyExists() {
      return this.$store.state.smartShoppingCampaigns.tagAlreadyExists;
    },
    // trackingStatus: {
    //   get() {
    //     return this.statusTrackingTag
    //   },
    //   set(value) {
    //   },
    // },
    alertTag() {
      if (this.trackingStatus === false && this.tagAlreadyExists === false) {
        return this.$i18n.t('smartShoppingCampaignCreation.alerts.noTag');
      }
      if (this.trackingStatus === false && this.tagAlreadyExists === true) {
        return this.$i18n.t('smartShoppingCampaignCreation.alerts.duplicatedTag');
      }
      return null;
    },
  },
  methods: {
    changeTrackingStatus() {
      if (this.trackingStatus === null) {
        this.$store.commit('smartShoppingCampaigns/TOGGLE_STATUS_REMARKETING_TRACKING_TAG', false);
      }
      this.$router.push({
        name: 'campaign-creation',
      });
    },
    changeStatus() {
      console.log(this.trackingStatus);
      this.$store.dispatch(
        'smartShoppingCampaigns/SAVE_STATUS_REMARKETING_TRACKING_TAG', this.trackingStatus,
      );
    },
  },
};
</script>
