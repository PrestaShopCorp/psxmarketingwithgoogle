<template>
  <b-alert
    show
    variant="info"
    v-if="GET_FEATURE_FLAG_ENHANCED_CONVERSIONS"
  >
    <div
      class="d-flex flex-column flex-md-row justify-content-between"
    >
      <p class="mb-0">
        <span class="h3">
          {{ $t('enhancedConversionTrackingCard.signTosAlert.title') }}
        </span>
        <br>
        <VueShowdown
          :markdown="$t('enhancedConversionTrackingCard.signTosAlert.text', [
            linkToInstructions
          ])"
          :extensions="['extended-link']"
        />
      </p>
      <div class="d-md-flex flex-grow-1 align-items-end mt-2 ml-1">
        <b-button
          class="mx-1 mt-0 mr-md-1 text-nowrap ml-auto"
          variant="outline-primary"
          target="_blank"
          :href="linkToTermsOfServices"
        >
          {{ $t('cta.enableEnhancedConversions') }}
        </b-button>
      </div>
    </div>
  </b-alert>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import GettersTypesApp from '@/store/modules/app/getters-types';
import googleUrl from '@/assets/json/googleUrl.json';

export default defineComponent({
  computed: {
    ...mapGetters('app', [
      GettersTypesApp.GET_FEATURE_FLAG_ENHANCED_CONVERSIONS,
    ]),
    linkToTermsOfServices(): string {
      return googleUrl.googleAdsConversionsTermsAndConditions;
    },
    linkToInstructions(): string {
      // TODO: Replace with actual URL
      return 'perdu.com';
    },
  },
});
</script>
