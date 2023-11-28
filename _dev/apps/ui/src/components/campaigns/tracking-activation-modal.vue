<template>
  <ps-modal
    :id="modalId"
    ref="modal"
    :title="$t('modal.titleActivateTracking')"
    v-bind="$attrs"
    @ok="updateTrackingStatus"
  >
    <img
      src="@/assets/images/empty-cart.svg"
      width="250"
      height="170" 
    />
    <VueShowdown
      class="mt-1 mb-4"
      :extensions="['extended-link']"
      :markdown="$t('modal.textActivateTracking')"
    />

    <template
      slot="modal-cancel"
    >
      {{ $t("cta.cancel") }}
    </template>
    <template
      slot="modal-ok"
    >
      {{ $t("cta.confirm") }}
    </template>
  </ps-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PsModal from '@/components/commons/ps-modal.vue';
import googleUrl from '@/assets/json/googleUrl.json';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default defineComponent({
  name: 'TrackingActivationModal',
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
});
</script>
