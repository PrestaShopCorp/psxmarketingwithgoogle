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
    <template
      v-else-if="allDataLoaded && !inNeedOfConfiguration && GET_ACCOUNT_HAS_AT_LEAST_ONE_CAMPAIGN"
    >
      <alert-sign-gads-tos
        v-if="!GET_CONVERSIONS_TERMS_OF_SERVICES_SIGNED"
      />
      <alert-ec-ready
        v-else-if="GET_ENHANCED_CONVERSIONS_NEVER_ENABLED"
        :is-on-configuration-page="false"
      />
    </template>
    <sync-overview
      :in-need-of-configuration="inNeedOfConfiguration"
      :loading="!allDataLoaded"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {mapGetters} from "vuex";
import { RequestState } from '@/store/types';
import SyncOverview from '@/components/product-feed-page/dashboard/sync-overview.vue';
import PsToast from '@/components/commons/ps-toast.vue';
import AlertEcReady from '@/components/enhanced-conversions/alert-ec-ready.vue';
import AlertSignGadsTos from "@/components/enhanced-conversions/alert-sign-gads-tos.vue";
import GettersTypesCampaigns from "@/store/modules/campaigns/getters-types";
import GettersTypesGoogleAds from "@/store/modules/google-ads/getters-types";

export default defineComponent({
  components: {
    AlertEcReady,
    AlertSignGadsTos,
    PsToast,
    SyncOverview,
  },
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    ...mapGetters("googleAds", [
      GettersTypesGoogleAds.GET_CONVERSIONS_TERMS_OF_SERVICES_SIGNED,
    ]),
    ...mapGetters("campaigns", [
      GettersTypesCampaigns.GET_ENHANCED_CONVERSIONS_NEVER_ENABLED,
      GettersTypesCampaigns.GET_ACCOUNT_HAS_AT_LEAST_ONE_CAMPAIGN,
    ]),
    allDataLoaded(): boolean {
      return this.$store.state.productFeed.warmedUp === RequestState.SUCCESS;
    },
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
  },
});
</script>