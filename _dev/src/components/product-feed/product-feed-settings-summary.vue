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
        {{ $t("cta.understandAndContinue") }}
      </b-button>
    </div>
    <product-feed-settings-footer />
  </div>
</template>

<script>
import ProductFeedSettingsFooter from './product-feed-settings-footer';

export default {
  name: 'ProductFeedSettingsExport',
  data() {
    return {
      syncFrequency: this.$i18n.t('productFeedSettings.export.frequency.daily'),
      syncTime: '2:00 AM',
      syncTimeZone: '(UTC+01:00) Normal time in Central Europe (Paris)',
    };
  },
  components: {
    ProductFeedSettingsFooter,
  },
  computed: {
  },
};
</script>
