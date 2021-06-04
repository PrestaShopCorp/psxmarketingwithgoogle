<template>
  <div>
    <h3 class="ps_gs-fz-16 font-weight-600 mb-3">
      Next synchronisation
    </h3>
    <div class="d-md-flex text-center justify-content-end mt-3 pt-2">
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.back") }}
      </b-button>
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.cancel") }}
      </b-button>
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t("cta.saveAndExport") }}
      </b-button>
    </div>
    <product-feed-settings-footer
      :message="$t('freeListingCard.googleDelay')"
    />
  </div>
</template>

<script>
import ProductFeedSettingsFooter from './product-feed-settings-footer';

export default {
  name: 'ProductFeedSettingsSummary',
  components: {
    ProductFeedSettingsFooter,
  },
};
</script>
