<template>
  <div>
    <PsToast
      v-if="allDataLoaded && syncStatus === 'schedule' && !inNeedOfConfiguration"
      variant="warning"
      :visible="syncStatus === 'schedule' && !inNeedOfConfiguration"
      toaster="b-toaster-top-right"
    >
      <p> {{ $t('productFeedPage.alert.alertSuccess') }}</p>
    </PsToast>
    <sync-overview
      :in-need-of-configuration="inNeedOfConfiguration"
      :loading="!allDataLoaded"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RequestState } from '@/store/types';
import SyncOverview from '@/components/product-feed-page/dashboard/sync-overview.vue';
import PsToast from '@/components/commons/ps-toast.vue';

export default defineComponent({
  components: {
    SyncOverview,
    PsToast,
  },
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    allDataLoaded(): boolean {
      return this.$store.state.productFeed.warmedUp === RequestState.SUCCESS;
    },
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
  },
});
</script>