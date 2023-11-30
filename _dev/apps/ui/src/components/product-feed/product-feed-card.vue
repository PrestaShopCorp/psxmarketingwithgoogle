<template>
  <section>
    <b-skeleton-wrapper
      :loading="loading"
      class="mb-3"
    >
      <template #loading>
        <b-card>
          <b-skeleton width="85%" />
          <b-skeleton width="55%" />
          <b-skeleton width="70%" />
        </b-card>
      </template>
      <b-card
        no-body
        class="ps_gs-onboardingcard p-3 mb-3"
        :class="{ 'ps_gs-onboardingcard--disabled': !isEnabled }"
        id="product-feed-card"
      >
        <div class="d-flex align-items-start align-items-md-center mb-3">
          <img
            class="mr-2"
            src="@/assets/images/product-feed-icon.svg"
            width="32"
            height="32"
            alt=""
          >
          <div class="flex-grow-1 d-flex flex-column align-items-md-center flex-md-row">
            <b-card-text
              class="flex-grow-1 flex-sm-wrap
              ps_gs-onboardingcard__title text-left mb-0"
            >
              {{ $t("productFeedCard.title") }}
            </b-card-text>
            <div
              class="flex-shrink-1 d-flex-md text-right"
              v-if="toConfigure"
            >
              <b-button
                size="sm"
                variant="primary"
                @click="startConfiguration"
                :disabled="!isEnabled || isErrorApi"
              >
                {{ getActiveStep > 1 ?
                  $t("cta.continueProductFeed") : $t("cta.configureAndExportProductFeed")
                }}
              </b-button>
            </div>
            <div
              v-else
              class="flex-shrink-1 align-items-end mb-1"
            >
              <i18n
                :path="syncStatus === 'schedule'
                  ? 'productFeedPage.syncStatus.scheduleOn'
                  : 'productFeedCard.nextSync'"
                class="mt-3 mt-md-0 text-right font-weight-600"
                tag="div"
              >
                <b-button
                  variant="link"
                  class="bg-transparent p-0 border-0
                    font-weight-600 ps_gs-fz-13 ml-auto"
                  @click="goToProductFeed()"
                >
                  {{ nextSyncTime }}
                </b-button>
              </i18n>
            </div>
          </div>
        </div>
        <div
          v-if="(isEnabled && toConfigure) || isErrorApi"
          class="ml-2 ps_gs-onboardingcard__content"
        >
          <p v-if="getActiveStep > 1">
            {{ $t("productFeedCard.introToConfigure") }}<br>
            <a
              :href="$options.googleUrl.productConfiguration"
              target="_blank"
            >
              {{ $t("cta.learnAboutProductConfiguration") }}
            </a>
          </p>
          <p v-else>
            {{ $t("productFeedCard.intro") }}
          </p>
          <product-feed-stepper
            v-if="getActiveStep > 1"
            :active-step="getActiveStep"
            vertical
          />
        </div>
        <div
          v-if="isEnabled && isErrorApi"
          class="mt-3"
        >
          <b-alert
            variant="warning"
            show
          >
            <VueShowdown
              :markdown="$t('productFeedCard.alertErrorApi')"
            />
            <div
              class="mt-1"
            >
              <b-button
                @click="refresh"
                variant="outline-secondary"
              >
                {{ $t("general.refreshPage") }}
              </b-button>
            </div>
          </b-alert>
        </div>
        <div
          v-if="isEnabled && !toConfigure && !isErrorApi"
          class="ml-2 ps_gs-onboardingcard__content"
        >
          <b-alert
            :variant="alert === 'FeedSettingSubmissionSuccess' ? 'info' : 'warning'"
            :show="!!alert && alert !== 'ShippingSettingsMissing'"
          >
            <VueShowdown
              :markdown="$t(`productFeedCard.alert${alert}`, alertLink)"
              :extensions="['extended-link']"
            />
            <div
              v-if="alert === 'ProductFeedExists'"
              class="mt-1"
            >
              <b-button variant="outline-secondary">
                {{ $t("cta.overwrite") }}
              </b-button>
            </div>
          </b-alert>
          <b-alert
            variant="warning"
            :show="!!alert && alert === 'ShippingSettingsMissing'"
          >
            <p>
              {{ $t("productFeedCard.alertShippingSettingsMissingDescription") }}
            </p>
          </b-alert>
          <b-container
            fluid
            class="p-0 mb-0 mt-n1"
          >
            <product-feed-summary-cards />
          </b-container>
        </div>
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script lang="ts">
import {VueShowdown} from 'vue-showdown';
import {defineComponent} from 'vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import googleUrl from '@/assets/json/googleUrl.json';
import ProductFeedStepper from '@/components/product-feed/product-feed-stepper.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import ProductFeedSummaryCards from '@/components/product-feed/summary/product-feed-summary-cards.vue';

export default defineComponent({
  name: 'ProductFeedCard',
  components: {
    ProductFeedStepper,
    VueShowdown,
    ProductFeedSummaryCards,
  },
  data() {
    return {
      ProductFeedSettingsPages,
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
      required: true,
    },
    loading: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  computed: {
    getProductFeedStatus() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'];
    },
    getActiveStep(): number {
      return this.$store.getters['productFeed/GET_STEP'];
    },
    nextSyncTime(): string {
      if (this.getProductFeedStatus.nextJobAt) {
        return new Date(this.getProductFeedStatus.nextJobAt).toLocaleString(
          window.i18nSettings.languageLocale.substring(0, 2),
        );
      }
      return '--';
    },
    toConfigure() {
      return !this.$store.state.productFeed.isConfigured;
    },
    alertLink() {
      if (this.alert === 'Failed') {
        return [this.$options.googleUrl.syncFailed];
      }
      return null;
    },
    alert() {
      if (this.getProductFeedStatus.success === false && this.getProductFeedStatus.jobEndedAt
      && this.getProductFeedStatus.lastUpdatedAt) {
        return 'Failed';
      }
      if (this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']) {
        return 'ShippingSettingsMissing';
      }
      if (
        this.getProductFeedStatus.lastUpdatedAt === null
      && this.getProductFeedStatus.success === false
      ) {
        return 'FeedSettingSubmissionSuccess';
      }
      // TODO: ProductFeedExists > Overwrite needed
      // if (something) {
      //   return 'ProductFeedExists';
      // }
      return null;
    },
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
    isErrorApi() {
      return this.$store.state.productFeed.errorAPI;
    },
  },
  methods: {
    startConfiguration() {
      const step = Object.values(ProductFeedSettingsPages)[this.getActiveStep - 1];

      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step,
        },
      });
      this.$segment.track('[GGL] Start Product feed configuration', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    refresh() {
      this.$router.go(0);
    },
    goToProductFeed() {
      this.$router.push({
        name: 'product-feed',
      });
    },
  },
  googleUrl,
});
</script>
