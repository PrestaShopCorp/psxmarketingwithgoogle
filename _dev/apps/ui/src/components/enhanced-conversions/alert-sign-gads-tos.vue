<template>
  <b-alert
    show
    variant="info"
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
      <div class="d-md-flex flex-grow-1 align-items-start mt-2 mt-md-0 ml-md-1">
        <b-button
          class="mx-1 mt-0 mr-md-1 text-nowrap ml-auto"
          variant="outline-primary"
          target="_blank"
          :href="linkToTermsOfServices"
          @click="enableEnhancedConversions"
        >
          {{ $t('cta.enableEnhancedConversions') }}
        </b-button>
      </div>
    </div>
  </b-alert>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import googleUrl from '@/assets/json/googleUrl.json';

export default defineComponent({
  computed: {
    linkToTermsOfServices(): string {
      return googleUrl.googleAdsEnhancedCoversionSettings;
    },
    linkToInstructions(): string {
      let locale = this.$i18n.locale.toLowerCase();
      const allowedLocales = ['en', 'fr'];

      if (allowedLocales.includes(locale)) {
        locale = 'en';
      }

      return `https://storage.googleapis.com/psessentials-documentation/psxmarketingwithgoogle/enhanced_conversion_how_to_${locale}.pdf`;
    },
  },
  methods: {
    async enableEnhancedConversions(): Promise<void> {
      await this.$store.dispatch('campaigns/SAVE_ENHANCED_CONVERSIONS_STATUS', true);
    },
  },
});
</script>
