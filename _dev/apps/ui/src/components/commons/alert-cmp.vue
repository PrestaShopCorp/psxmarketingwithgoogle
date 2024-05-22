<template>
  <div class="col-12">
    <b-alert
      variant="info"
      show
    >
      <div>
        <div class="h3">
          {{ $t('onboarding.cmpAlert.title') }}
        </div>
        <i18n
          path="onboarding.cmpAlert.paragraph"
          tag="p"
          class="mb-2"
        >
          <template #link>
            <a
              :href="GDPRModuleLink"
              target="_blank"
              rel="noopener"
            >{{ $t('onboarding.cmpAlert.moduleGDPR') }}</a>
          </template>
        </i18n>
        <b-button
          size="sm"
          variant="outline-info"
          @click="onClick"
        >
          {{ $t('cta.understand') }}
        </b-button>
      </div>
    </b-alert>
  </div>
</template>

<script>
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'AlertCMP',
  methods: {
    sendEvent() {
      this.$segment.track('[GGL] Understand CMP requirement', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    onClick() {
      this.$emit('close');
      this.sendEvent();
    },
  },
  computed: {
    GDPRModuleLink() {
      return `https://addons.prestashop.com/${this.$i18n.locale}/legal/21644-cookies-gdpr-law-blocker-google-consent-mode-v2.html`;
    },
  },
};
</script>
