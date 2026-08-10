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
        </b-card>
      </template>
      <b-card
        id="product-feed-card"
        no-body
        class="ps_gs-onboardingcard p-3 mb-3"
        :class="{'ps_gs-onboardingcard--disabled': !isEnabled}"
      >
        <div class="d-flex align-items-center mb-3">
          <img
            class="mr-2"
            src="@/assets/images/product-feed-icon.svg"
            width="32"
            height="32"
            alt=""
          >
          <b-card-text class="ps_gs-onboardingcard__title text-left mb-0">
            {{ $t('tinyLuxGoogle.syncTitle') }}
          </b-card-text>
        </div>

        <div
          v-if="isEnabled"
          class="ml-2 ps_gs-onboardingcard__content"
        >
          <template v-if="!dataSourceIsReady">
            <p>
              {{ $t('tinyLuxGoogle.dataSourceIntro') }}
            </p>
            <b-button
              data-test="create-data-source"
              size="sm"
              variant="primary"
              :disabled="operationIsRunning"
              @click="createDataSource"
            >
              {{ $t('tinyLuxGoogle.dataSourceButton') }}
            </b-button>
          </template>

          <template v-else>
            <p class="mb-3">
              {{ $t('tinyLuxGoogle.dataSourceReady') }}
            </p>
            <div class="d-flex flex-wrap mb-3">
              <b-button
                data-test="configure-products"
                size="sm"
                variant="outline-secondary"
                class="mr-2 mb-2"
                @click="startConfiguration"
              >
                {{ $t('tinyLuxGoogle.configureProducts') }}
              </b-button>
              <b-button
                data-test="start-sync"
                size="sm"
                variant="primary"
                class="mb-2"
                :disabled="operationIsRunning || jobIsActive"
                @click="startSynchronization"
              >
                {{ $t('tinyLuxGoogle.syncTitle') }}
              </b-button>
            </div>
            <SyncJobStatus
              v-if="syncJob"
              :job="syncJob"
              @retry="retryFailed"
            />
          </template>

          <b-alert
            v-if="operationError"
            show
            variant="warning"
            class="mt-3 mb-0"
          >
            {{ $t('tinyLuxGoogle.operationFailed') }}
          </b-alert>
        </div>
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import SyncJobStatus from '@/components/product-feed/sync-job-status.vue';
import {SyncJob} from '@/store/modules/product-feed/state';

const ACTIVE_JOB_STATUSES = ['pending', 'running'];
const POLL_DELAY_MS = 1500;

export default defineComponent({
  name: 'ProductFeedCard',
  components: {SyncJobStatus},
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
  data() {
    return {
      operationIsRunning: false,
      operationError: false,
      pollTimer: null as ReturnType<typeof setTimeout>|null,
    };
  },
  computed: {
    dataSourceIsReady(): boolean {
      return Boolean(this.$store.state.accounts.googleAccount.dataSource);
    },
    syncJob(): SyncJob|null {
      return this.$store.getters['productFeed/GET_SYNC_JOB'];
    },
    jobIsActive(): boolean {
      return this.isActive(this.syncJob);
    },
    activeStep(): number {
      return this.$store.getters['productFeed/GET_STEP'];
    },
  },
  methods: {
    isActive(job: SyncJob|null): boolean {
      return Boolean(job && ACTIVE_JOB_STATUSES.includes(job.status));
    },
    async createDataSource() {
      this.operationIsRunning = true;
      this.operationError = false;
      try {
        const {language} = new Intl.Locale(window.i18nSettings.languageLocale);
        const feedLabel = this.$store.state.app.psxMtgWithGoogleDefaultShopCountry
          || this.$store.state.app.psxMktgWithGoogleActiveCountries[0]
          || 'GB';
        await this.$store.dispatch('accounts/CREATE_DATA_SOURCE', {
          contentLanguage: language,
          feedLabel: String(feedLabel).toUpperCase(),
        });
      } catch (error) {
        this.operationError = true;
      } finally {
        this.operationIsRunning = false;
      }
    },
    startConfiguration() {
      const step = Object.values(ProductFeedSettingsPages)[Math.max(0, this.activeStep - 1)];

      this.$router.push({
        name: 'product-feed-settings',
        params: {step},
      });
    },
    async startSynchronization() {
      this.operationIsRunning = true;
      this.operationError = false;
      try {
        const job = await this.$store.dispatch('productFeed/START_SYNC_JOB', {full: true});

        if (this.isActive(job)) {
          this.scheduleNextPoll();
        }
      } catch (error) {
        this.operationError = true;
      } finally {
        this.operationIsRunning = false;
      }
    },
    async retryFailed(jobId: number) {
      this.operationIsRunning = true;
      this.operationError = false;
      try {
        const job = await this.$store.dispatch('productFeed/RETRY_FAILED_SYNC_JOB', {jobId});

        if (this.isActive(job)) {
          this.scheduleNextPoll();
        }
      } catch (error) {
        this.operationError = true;
      } finally {
        this.operationIsRunning = false;
      }
    },
    scheduleNextPoll() {
      this.stopPolling();
      if (!this.jobIsActive) {
        return;
      }
      this.pollTimer = setTimeout(async () => {
        this.pollTimer = null;
        try {
          let job = await this.$store.dispatch('productFeed/GET_SYNC_JOB_STATUS', {
            jobId: this.syncJob?.jobId,
          });

          if (this.isActive(job)) {
            job = await this.$store.dispatch('productFeed/RUN_SYNC_JOB', {
              jobId: job.jobId,
            });
          }
          if (this.isActive(job)) {
            this.scheduleNextPoll();
          }
        } catch (error) {
          this.operationError = true;
        }
      }, POLL_DELAY_MS);
    },
    stopPolling() {
      if (this.pollTimer) {
        clearTimeout(this.pollTimer);
        this.pollTimer = null;
      }
    },
  },
  watch: {
    syncJob(job: SyncJob|null) {
      if (this.isActive(job)) {
        this.scheduleNextPoll();
        return;
      }
      this.stopPolling();
    },
  },
  mounted() {
    if (this.jobIsActive) {
      this.scheduleNextPoll();
    }
  },
  beforeDestroy() {
    this.stopPolling();
  },
});
</script>
