<template>
  <ps-modal
    :id="modalId"
    ref="modal"
    :title="$t('modal.titleActivateTrackingSSC')"
    v-bind="$attrs"
    @ok="updateTrackingStatus"
    @show="onShow"
    :ok-disabled="isLoading"
  >
    <VueShowdown
      class="mt-1 mb-4"
      :extensions="['extended-link']"
      :markdown="$t('modal.textActivateTrackingSSC',
                    [$options.googleUrl.remarketingList,
                     $options.googleUrl.conversionTrackingTags])"
    />
    <p
      v-if="isLoading"
      class="text-center pt-2 mb-2"
    >
      <span class="mr-1 icon-busy icon-busy--dark icon-busy--big ps_gs-fz-20" />
      {{ $t('smartShoppingCampaignCreation.remarketingTagLoading') }}
    </p>
    <template v-else>
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
      <b-form-checkbox
        switch
        size="lg"
        class="mt-3 ps_gs-switch"
        disabled
        v-model="requestNewConversionTrackingTags"
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
    </template>
    <template
      slot="modal-cancel"
    >
      {{ $t("cta.cancel") }}
    </template>
    <template
      slot="modal-ok"
    >
      {{ $t("cta.continue") }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';
import googleUrl from '@/assets/json/googleUrl.json';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'SSCPopinActivateTracking',
  components: {
    PsModal,
  },
  props: {
    modalId: {
      type: String,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      isLoading: false,
      requestNewConversionTrackingTags: true,
      statusTrackingTag: this.$store.state.campaigns.tracking,
    };
  },
  computed: {
    tagAlreadyExists() {
      return this.$store.state.campaigns.tagAlreadyExists;
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
      this.$segment.track('[GGL] Create SSC Remarketing Conversion Step', {
        module: 'psxmarketingwithgoogle',
        remarketing_tab_value: this.statusTrackingTag,
        conversion_tracking_value: this.requestNewConversionTrackingTags,
        params: SegmentGenericParams,
      });
      this.$store.dispatch(
        'campaigns/SAVE_STATUS_REMARKETING_TRACKING_TAG', this.statusTrackingTag,
      );
      if (this.requestNewConversionTrackingTags) {
        this.$store.dispatch('campaigns/CREATE_REMARKETING_DEFAULT_CONVERSION_ACTIONS');
      }
      this.$router.push({
        name: 'campaign-creation',
      });
    },
    onShow() {
      this.isLoading = true;
      this.$store.dispatch('campaigns/GET_REMARKETING_TRACKING_TAG_STATUS_IF_ALREADY_EXISTS')
        .then(() => {
          // Disable the toggle if the tag is found on the shop, so we can display the alert
          if (this.tagAlreadyExists) {
            this.statusTrackingTag = false;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  googleUrl,
};
</script>
