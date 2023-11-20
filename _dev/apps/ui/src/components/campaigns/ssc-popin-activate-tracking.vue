<template>
  <ps-modal
    :id="modalId"
    ref="modal"
    :title="$t('modal.titleActivateTrackingSSC')"
    v-bind="$attrs"
    @ok="updateTrackingStatus"
  >
    <VueShowdown
      class="mt-1 mb-4"
      :extensions="['extended-link']"
      :markdown="$t('modal.textActivateTrackingSSC',
                    [$options.googleUrl.remarketingList,
                     $options.googleUrl.conversionTrackingTags])"
    />
    <template>
      <b-form-checkbox
        switch
        size="lg"
        class="mt-3 ps_gs-switch"
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
  methods: {
    updateTrackingStatus() {
      this.$segment.track('[GGL] Create SSC Remarketing Conversion Step', {
        module: 'psxmarketingwithgoogle',
        remarketing_tab_value: true,
        conversion_tracking_value: true,
        params: SegmentGenericParams,
      });
      this.$store.dispatch(
        'campaigns/SAVE_STATUS_REMARKETING_TRACKING_TAG', true,
      );
      this.$store.dispatch('campaigns/CREATE_REMARKETING_DEFAULT_CONVERSION_ACTIONS');
      this.$router.push({
        name: 'campaign-creation',
      });
    },
  },
  googleUrl,
};
</script>
