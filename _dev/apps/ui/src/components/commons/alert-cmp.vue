<template>
  <div
    v-if="displayAlert"
    class="col-12"
  >
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
import {getDataFromLocalStorage} from '@/utils/LocalStorage';
import GettersTypes from '@/store/modules/google-ads/getters-types';

const localStorageSave = 'google-cmp-closed';

export default {
  name: 'AlertCMP',
  data() {
    return {
      display: false,
    };
  },
  methods: {
    sendEvent() {
      this.$segment.track('[GGL] Understand CMP requirement', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    onClick() {
      localStorage.setItem(localStorageSave, '1');
      this.sendEvent();
      this.display = false;
    },
  },
  computed: {
    GDPRModuleLink() {
      return `https://addons.prestashop.com/${this.$i18n.locale}/legal/21644-cookies-gdpr-law-blocker-google-consent-mode-v2.html`;
    },
    displayAlert() {
      return this.display && this.$store.getters[`googleAds/${GettersTypes.GET_GOOGLE_ADS_ACCOUNT_CHOSEN}`];
    },
  },
  mounted() {
    this.display = !getDataFromLocalStorage(localStorageSave);
  },
};
</script>
