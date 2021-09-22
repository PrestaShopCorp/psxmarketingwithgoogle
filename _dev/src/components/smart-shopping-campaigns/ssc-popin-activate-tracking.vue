<template>
  <ps-modal
    id="SSCPopinActivateTracking"
    ref="modal"
    :title="$t('modal.titleActivateTrackingSSC')"
    v-bind="$attrs"
    @ok="updateTrackingStatus"
  >
    <!-- TODO  : missing links -->
    <VueShowdown
      class="mt-1 mb-4"
      :extensions="['extended-link']"
      :markdown="$t('modal.textActivateTrackingSSC',
        [$options.googleUrl.remarketingList, $options.googleUrl.conversionTrackingTags])"
    />
    <b-form-checkbox
      switch
      size="lg"
      class="mt-3 ps_gs-switch"
      v-model="statusTrackingTag"
      @change="changeStatus"
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
    <b-form-checkbox
      switch
      size="lg"
      class="mt-3 ps_gs-switch"
      disabled
      :checked="true"
    >
      <span class="ps_gs-fz-14 text-dark d-block">
        {{ $t('smartShoppingCampaignCreation.toggleNewConversionTag') }}
      </span>
      <span class="ps_gs-fz-12 text-muted d-block">
        {{ $t('smartShoppingCampaignCreation.toggleNewConversionTag2') }}
      </span>
    </b-form-checkbox>
    <VueShowdown
      tag="p"
      class="mt-3 mb-4 ps_gs-fz-12 text-muted"
      :markdown="$t('smartShoppingCampaignCreation.remarketingNote')"
      :extensions="['no-p-tag']"
    />
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
import googleUrl from '@/assets/json/googleUrl.json';

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
    alertTag() {
      if (this.statusTrackingTag === false && this.tagAlreadyExists === false) {
        return this.$i18n.t('smartShoppingCampaignCreation.alerts.noTag');
      }
      if (this.statusTrackingTag === false && this.tagAlreadyExists === true) {
        return this.$i18n.t('smartShoppingCampaignCreation.alerts.duplicatedTag');
      }
      return null;
    },
  },
  methods: {
    updateTrackingStatus() {
      if (this.statusTrackingTag === null) {
        this.$store.commit('smartShoppingCampaigns/TOGGLE_STATUS_REMARKETING_TRACKING_TAG', false);
      }
      this.$router.push({
        name: 'campaign-creation',
      });
    },
    changeStatus() {
      this.$store.dispatch(
        'smartShoppingCampaigns/SAVE_STATUS_REMARKETING_TRACKING_TAG', this.statusTrackingTag,
      );
    },
  },
  googleUrl,
};
</script>
