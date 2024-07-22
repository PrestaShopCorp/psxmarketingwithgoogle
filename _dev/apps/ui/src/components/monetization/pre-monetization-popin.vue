<template>
  <ps-modal
    id="PreMonetizationPopin"
    ref="modal"
    v-bind="$attrs"
    hide-footer
    visible
    @close="onClose"
    @hidden="onClose"
    v-if="!!display"
  >
    <template #modal-title>
      <h4
        class="rounded-circle
        bg-ocean-blue-50 d-inline-flex align-items-center justify-content-center mr-2"
        style="width: 40px; height: 40px;"
      >
        <i class="material-icons ps_gs-fz-24">update</i>
      </h4>
      {{ $t('banner.monetization.titleInfo') }}
    </template>
    <p>{{ $t('banner.monetization.infoPrice') }}</p>
    <p>{{ $t('banner.monetization.freeTrial') }}</p>
    <p class="ps_gs-fz-12 text-primary-700">
      {{ $t('banner.monetization.hostedSubscribers') }}
    </p>
    <div class="mb-3 d-flex justify-content-end">
      <template>
        <b-button
          class="mr-2"
          variant="outline-secondary"
          @click="onClose"
        >
          {{ $t('cta.close') }}
        </b-button>
      </template>
      <template>
        <b-button
          variant="primary"
          @click="onClickNotify"
        >
          {{ $t('cta.notifyAvailable') }}
        </b-button>
      </template>
    </div>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

const localStorageDisplayModal = 'modal-pre-monatization';

export default {
  name: 'PreMonetizationPopin',
  components: {
    PsModal,
  },
  data() {
    return {
      display: getDataFromLocalStorage(localStorageDisplayModal) ?? 1,
    };
  },
  methods: {
    trackEvent() {
      this.$segment.track('[GGL] Notify Pre-monetization', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    onClose() {
      localStorage.setItem(localStorageDisplayModal, '0');

      this.$store.dispatch('app/SET_BANNER_INFO_LOCAL_STORAGE_MONETIZATION', 1);
      this.display = 0;
    },
    onClickNotify() {
      localStorage.setItem(localStorageDisplayModal, '0');

      this.trackEvent();
      this.display = 0;

      this.$store.dispatch('app/SET_BANNER_SUCCESS_LOCAL_STORAGE_MONETIZATION', 1);
    },
  },
};
</script>
