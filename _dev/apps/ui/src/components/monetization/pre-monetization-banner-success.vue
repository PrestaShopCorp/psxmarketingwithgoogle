<template>
  <div
    class="p-0"
  >
    <b-alert
      v-if="!!displayBanner"
      class="border border-success"
      variant="success"
      dismissible
      show
      @dismissed="onClose"
    >
      <div>
        {{ $t('banner.monetization.textNotifyPreMonetization') }}
      </div>
    </b-alert>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import GettersTypes from '@/store/modules/app/getters-types';

const localStorageDisplayBannerSuccess = 'banner-success-pre-monatization';

export default defineComponent({
  methods: {
    onClose() {
      localStorage.setItem(localStorageDisplayBannerSuccess, '0');
      this.$store.dispatch('app/GET_BANNER_SUCCESS_LOCAL_STORAGE_MONETIZATION', 0);
    },
  },
  computed: {
    ...mapGetters('app', {
      displayBanner: GettersTypes.GET_BANNER_SUCCESS_PRE_MONETIZATION,
    }),
  },
});
</script>
