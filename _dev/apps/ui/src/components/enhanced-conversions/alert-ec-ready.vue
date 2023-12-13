<template>
  <b-alert
    show
    variant="info"
    dismissible
    @dismissed="disableEnhancedConversions"
  >
    <div
      class="d-flex flex-column flex-md-row justify-content-between"
    >
      <p class="mb-0">
        <span class="h3">
          {{ $t('enhancedConversionTrackingCard.enableEnhancedConversionAlert.title') }}
        </span>
        <br>
        <span
          v-if="!isOnConfigurationPage"
        >
          {{ $t('enhancedConversionTrackingCard.enableEnhancedConversionAlert.text') }}
        </span>
      </p>
      <div
        class="d-md-flex flex-grow-1 text-center align-items-end mt-2 mr-2"
        v-if="!isOnConfigurationPage"
      >
        <b-button
          class="mx-1 mt-3 mt-md-0 mr-md-1 text-nowrap ml-auto"
          variant="outline-primary"
          @click="enableEnhancedConversions"
        >
          {{ $t('cta.enableEnhancedConversions') }}
        </b-button>
      </div>
    </div>
  </b-alert>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    isOnConfigurationPage: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    async enableEnhancedConversions(): Promise<void> {
      await this.$store.dispatch('campaigns/SAVE_ENHANCED_CONVERSIONS_STATUS', true);
    },
    async disableEnhancedConversions(): Promise<void> {
      await this.$store.dispatch('campaigns/SAVE_ENHANCED_CONVERSIONS_STATUS', false);
    },
  },
});
</script>