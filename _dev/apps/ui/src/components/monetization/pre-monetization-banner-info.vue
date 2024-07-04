<template>
  <div
    class="p-0"
  >
    <b-alert
      v-if="!!displayBanner"
      class="border border-info"
      variant="info"
      dismissible
      show
      @dismissed="onClose"
    >
      <h3 class="h3">
        {{ $t('banner.monetization.titleInfo') }}
      </h3>
      <p class="mb-2">
        {{ $t('banner.monetization.infoPrice') }}
      </p>
      <p class="mb-2">
        {{ $t('banner.monetization.freeTrial') }}
      </p>
      <p class="ps_gs-fz-12 text-primary-700">
        {{ $t('banner.monetization.hostedSubscribers') }}
      </p>
      <b-button
        class="mt-3 btn btn-info px-3 py-2 ml-3"
        variant="info"
        @click="onNotify"
      >
        {{ $t('cta.notifyAvailable') }}
      </b-button>
    </b-alert>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import GettersTypes from '@/store/modules/app/getters-types';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

const localStorageDisplayBannerSuccess = 'banner-success-pre-monatization';
const localStorageDisplayBannerInfo = 'banner-info-pre-monatization';

export default defineComponent({
  methods: {
    onClose() {
      localStorage.setItem(localStorageDisplayBannerInfo, '0');

      this.$store.dispatch('app/GET_BANNER_INFO_LOCAL_STORAGE_MONETIZATION', 0);
    },
    trackEvent() {
      this.$segment.track('[GGL] Notify Pre-monetization', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    onNotify() {
      localStorage.setItem(localStorageDisplayBannerInfo, '0');
      localStorage.setItem(localStorageDisplayBannerSuccess, '1');

      this.trackEvent();

      this.$store.dispatch('app/GET_BANNER_INFO_LOCAL_STORAGE_MONETIZATION', 0);
      this.$store.dispatch('app/GET_BANNER_SUCCESS_LOCAL_STORAGE_MONETIZATION', 1);
    },
  },
  computed: {
    ...mapGetters('app', {
      displayBanner: GettersTypes.GET_BANNER_INFO_PRE_MONETIZATION,
    }),
  },
});
</script>
