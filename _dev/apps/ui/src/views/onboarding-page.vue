<template>
  <div class="pt-2 tiny-lux-google-onboarding">
    <header class="mb-4">
      <h1 class="h2 mb-2">
        {{ $t('tinyLuxGoogle.title') }}
      </h1>
      <p class="mb-0 text-muted">
        {{ $t('tinyLuxGoogle.intro') }}
      </p>
    </header>

    <GoogleCredentialsForm
      v-if="!localGoogleIsConfigured"
      :connection="googleConnection"
      @configured="onGoogleCredentialsConfigured"
    />

    <div class="mb-4 ps_gs-onboardingpage">
      <two-panel-cols
        :title="$t('tinyLuxGoogle.connectTitle')"
        :description="$t('tinyLuxGoogle.connectDescription')"
      >
        <google-account-card
          v-if="localGoogleIsConfigured"
          :is-enabled="true"
          :loading="googleIsLoading"
          :user="googleAccount"
          @connectGoogleAccount="onGoogleAccountConnection"
          @dissociateGoogleAccount="onGoogleAccountDissociationRequest"
        />
        <MerchantCenterAccountCard
          :is-enabled="googleAccountIsOnboarded"
          :loading="merchantIsLoading"
          :is-linking="isMerchantLinking"
          @selectMerchantCenterAccount="onMerchantCenterAccountSelected"
        />
        <ProductFeedCard
          :is-enabled="merchantCenterAccountIsChosen"
          :loading="productFeedIsLoading"
        />
      </two-panel-cols>

      <two-panel-cols
        :title="$t('tinyLuxGoogle.adsTitle')"
        :description="$t('tinyLuxGoogle.adsDescription')"
      >
        <section class="card ps_gs-onboardingcard p-3 mb-3 ps_gs-onboardingcard--disabled">
          <h2 class="h4 mb-2">
            {{ $t('tinyLuxGoogle.adsTitle') }}
          </h2>
          <p class="mb-0">
            {{ $t('tinyLuxGoogle.developerTokenRequired') }}
          </p>
        </section>
      </two-panel-cols>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import GoogleAccountCard from '@/components/google-account/google-account-card.vue';
import MerchantCenterAccountCard from '@/components/merchant-center-account/merchant-center-account-card.vue';
import ProductFeedCard from '@/components/onboarding/product-feed-card.vue';
import TwoPanelCols from '@/components/onboarding/two-panel-cols.vue';
import GoogleCredentialsForm from '@/components/settings/google-credentials-form.vue';

const emptyConnection = {
  configured: false,
  clientIdSuffix: '',
  redirectUri: '',
  connected: false,
  googleEmail: null,
  merchantAccount: null,
  dataSource: null,
};

export default defineComponent({
  name: 'OnboardingPage',
  components: {
    GoogleAccountCard,
    GoogleCredentialsForm,
    MerchantCenterAccountCard,
    ProductFeedCard,
    TwoPanelCols,
  },
  data() {
    return {
      googleConnection: {
        ...emptyConnection,
        ...(window.tinyLuxGoogleConnection || {}),
      },
      googleIsLoading: false,
      merchantIsLoading: false,
      productFeedIsLoading: false,
      isMerchantLinking: false,
    };
  },
  computed: {
    localGoogleIsConfigured(): boolean {
      return this.$store.getters['accounts/GET_LOCAL_GOOGLE_IS_CONFIGURED'];
    },
    googleAccountIsOnboarded(): boolean {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_IS_ONBOARDED'];
    },
    googleAccount() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT'];
    },
    merchantCenterAccountIsChosen(): boolean {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED'];
    },
  },
  methods: {
    async onGoogleCredentialsConfigured(connection) {
      this.googleConnection = {...this.googleConnection, ...connection};
      this.$store.commit('accounts/SET_GOOGLE_ACCOUNT', {
        ...this.googleAccount,
        ...connection,
        connected: false,
        googleEmail: null,
        merchantAccount: null,
        dataSource: null,
      });
      await this.$store.dispatch('accounts/REQUEST_ROUTE_TO_GOOGLE_AUTH');
    },
    onGoogleAccountConnection() {
      this.$store.commit('accounts/SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE', true);
    },
    async onGoogleAccountDissociationRequest() {
      await this.$store.dispatch('accounts/DISSOCIATE_GOOGLE_ACCOUNT');
    },
    async onMerchantCenterAccountSelected(selectedAccount) {
      this.isMerchantLinking = true;
      try {
        await this.$store.dispatch(
          'accounts/SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT',
          {selectedAccount},
        );
        this.$store.commit('accounts/SAVE_MCA_CONNECTED_ONCE', true);
      } finally {
        this.isMerchantLinking = false;
      }
    },
  },
  async created() {
    this.googleIsLoading = true;
    this.merchantIsLoading = true;
    this.productFeedIsLoading = true;
    try {
      await this.$store.dispatch('accounts/WARMUP_STORE');
      await this.$store.dispatch('productFeed/WARMUP_STORE');
    } finally {
      this.googleIsLoading = false;
      this.merchantIsLoading = false;
      this.productFeedIsLoading = false;
    }
  },
});
</script>
