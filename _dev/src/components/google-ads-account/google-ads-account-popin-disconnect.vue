<template>
  <ps-modal
    id="GoogleAdsAccountPopinDisconnect"
    ref="modal"
    :title="$t('modal.titleDisconnectionGoogleAds')"
    v-bind="$attrs"
    @ok="onGoogleAdsAccountDissociationConfirmation"
    :cancel-disabled="processing"
    :ok-disabled="processing"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.textDisconnectGoogleAds')"
    />
    <template v-if="SSCExist">
      <!-- <b-form-checkbox
        v-model="pauseCampaigns"
        switch
        size="lg"
        class="mt-2 ps_gs-switch"
        @change="changeStatusPause"
      >
        <span class="ps_gs-fz-14">
          {{ $t('modal.pauseCampaigns') }}
        </span>
        <p
          class="text-muted mb-0 ps_gs-fz-12"
        >
          {{ $t('modal.pauseCampaignsExplainations') }}
        </p>
      </b-form-checkbox> -->

      <b-form-checkbox
        v-model="removeTag"
        switch
        size="lg"
        class="mt-2 ps_gs-switch"
        @change="changeStatusTag"
      >
        <span class="ps_gs-fz-14">
          {{ $t('modal.removeTag') }}
        </span>
        <p
          class="text-muted mb-0 ps_gs-fz-12"
        >
          {{ $t('modal.removeTagExplainations') }}
        </p>
      </b-form-checkbox>
    </template>
    <template slot="modal-cancel">
      {{ $t('cta.cancel') }}
    </template>
    <template slot="modal-ok">
      {{ $t('cta.disconnect') }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';

export default {
  name: 'GoogleAdsAccountPopinDisconnect',
  components: {
    PsModal,
  },
  data() {
    return {
      processing: false,
      removeTag: false,
      pauseCampaigns: false,
    };
  },
  methods: {
    onGoogleAdsAccountDissociationConfirmation(bvModalEvt) {
      this.processing = true;
      bvModalEvt.preventDefault();
      this.$store.dispatch('googleAds/DISSOCIATE_GOOGLE_ADS_ACCOUNT').finally(
        () => {
          this.processing = false;
          this.$bvModal.hide('GoogleAdsAccountPopinDisconnect');
        },
      );
    },
    // changeStatusPause() {
    //   //  TODO change all campaigns status to pause
    // },
    changeStatusTag() {
      this.$store.dispatch(
        // Here the toggle is true when we want to delete the remarketing tag
        // Which is why we have to send the contrary to 'save status remarketing tracking tag'
        'smartShoppingCampaigns/SAVE_STATUS_REMARKETING_TRACKING_TAG', !this.removeTag,
      );
    },
  },
  computed: {
    SSCExist() {
      //  TODO return if a SSC already exists to display toggle tag and toggle pause
      return true;
    },
  },
};
</script>
