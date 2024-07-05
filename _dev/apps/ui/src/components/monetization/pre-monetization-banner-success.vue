<template>
  <div v-if="!!displayBanner">
    <b-alert
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

export default defineComponent({
  methods: {
    onClose() {
      this.$store.dispatch('app/SET_BANNER_SUCCESS_LOCAL_STORAGE_MONETIZATION', 0);
    },
  },
  computed: {
    ...mapGetters('app', {
      displayBanner: GettersTypes.GET_BANNER_SUCCESS_PRE_MONETIZATION,
    }),
  },
});
</script>
