<template>
  <b-alert
    v-if="gAdsAccountAlert !== null"
    :variant="gAdsAccountAlert.color"
    show
    class="mb-0 mt-3"
  >
    <div>
      <VueShowdown
        tag="p"
        :class="!!gAdsAccountAlert.link && 'd-inline'"
        :markdown="gAdsAccountAlert.text"
        :extensions="['no-p-tag', 'target_link']"
      />
      <a
        v-if="!!gAdsAccountAlert.link"
        class="text-muted"
        :href="gAdsAccountAlert.link.url"
        target="_blank"
      >
        {{ gAdsAccountAlert.link.label }}
      </a>
      <div
        v-if="gAdsAccountAlert.button"
        class="d-md-flex text-center align-items-center mt-2"
      >
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1"
          variant="outline-secondary"
          :href="gAdsAccountAlert.button.type === 'link' ? gAdsAccountAlert.button.url : null"
          :target="gAdsAccountAlert.button.type === 'link' ? '_blank' : null"
          @click="gAdsAccountAlert.button.type === 'refresh' ? refresh() : null"
        >
          {{ gAdsAccountAlert.button.label }}
        </b-button>
      </div>
    </div>
  </b-alert>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';

export default {
  name: 'GoogleAdsAccountAlert',
  props: {
    error: {
      type: String,
      default: null,
    },
  },
  methods: {
    refresh() {
      this.$router.go();
    },
  },
  computed: {
    gAdsAccountAlert() {
      // TODO has to define the right conditions
      switch (this.error) {
        case 'CantConnect':
          return {
            color: 'warning',
            text: this.$i18n.t('googleAdsAccountCard.alertCantConnect'),
            button: {
              type: 'refresh',
              label: this.$i18n.t('general.refreshPage'),
            },
          };
        case 'BillingSettingsMissing':
          return {
            color: 'warning',
            text: this.$i18n.t('googleAdsAccountCard.alertBillingSettingsMissing'),
            button: {
              type: 'link',
              label: this.$i18n.t('cta.addBillingSettings'),
              url: '//placeholder.com/foo',
            },
          };
        case 'NeedRefreshAfterBilling':
          return {
            color: 'warning',
            text: this.$i18n.t('googleAdsAccountCard.alertNeedRefreshAfterBilling'),
            button: {
              type: 'refresh',
              label: this.$i18n.t('general.refreshPage'),
            },
          };
        case 'Suspended':
          return {
            color: 'danger',
            text: this.$i18n.t('googleAdsAccountCard.alertSuspended',
              [googleUrl.googleAdsAccount]),
            link: {
              label: 'Learn about account suspension',
              url: this.$options.googleUrl.googleAdsAccountSuspension,
            },
          };
        case 'Cancelled':
          return {
            color: 'danger',
            text: this.$i18n.t('googleAdsAccountCard.alertCancelled',
              [googleUrl.googleAdsAccount]),
            link: {
              label: 'Learn about account cancellation',
              url: this.$options.googleUrl.googleAdsAccountCancellation,
            },
          };
        default:
          return null;
      }
    },
  },
  googleUrl,
};
</script>
