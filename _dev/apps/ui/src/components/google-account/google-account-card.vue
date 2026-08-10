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
        no-body
        class="ps_gs-onboardingcard p-3 mb-3"
        :class="{'ps_gs-onboardingcard--disabled': !isEnabled}"
      >
        <div class="d-flex align-items-center mb-3">
          <img
            class="mr-2 rounded-circle"
            src="@/assets/images/google-icon.svg"
            width="32"
            height="32"
            alt=""
          >
          <b-card-text class="ps_gs-onboardingcard__title text-left mb-0">
            {{ $t('tinyLuxGoogle.connectTitle') }}
          </b-card-text>
          <b-badge
            v-if="isConnected"
            class="ml-3"
            variant="success"
          >
            {{ $t('badge.connected') }}
          </b-badge>
        </div>

        <div
          v-if="isEnabled"
          class="ml-2 ps_gs-onboardingcard__content"
        >
          <template v-if="!isConnected">
            <p>
              {{ $t('tinyLuxGoogle.googleIntro') }}
            </p>
            <a
              v-if="authenticationUrl"
              data-test-id="btn-connect"
              class="btn btn-primary btn-sm"
              :href="authenticationUrl"
            >
              {{ $t('cta.signInWithGoogle') }}
            </a>
            <b-alert
              v-else
              show
              variant="warning"
              class="mb-0 mt-3"
            >
              <p class="mb-2">
                {{ $t('googleAccountCard.alertCantConnect') }}
              </p>
              <b-button
                data-test-id="btn-refresh"
                size="sm"
                variant="outline-secondary"
                @click="refresh"
              >
                {{ $t('general.refreshPage') }}
              </b-button>
            </b-alert>
          </template>

          <template v-else>
            <div class="d-flex flex-wrap align-items-center justify-content-between">
              <a
                :href="$options.googleUrl.manageGoogleAccount"
                target="_blank"
                rel="noopener noreferrer"
                class="external_link-no_icon link-regular text-break"
              >
                {{ user.details.email }}
              </a>
              <div>
                <a
                  v-if="authenticationUrl"
                  class="btn btn-outline-secondary btn-sm mr-2"
                  :href="authenticationUrl"
                >
                  {{ $t('cta.manageAccount') }}
                </a>
                <b-button
                  data-test="disconnect-google"
                  size="sm"
                  variant="outline-secondary"
                  @click="$emit('dissociateGoogleAccount')"
                >
                  {{ $t('cta.disconnect') }}
                </b-button>
              </div>
            </div>
          </template>
        </div>
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {BAlert} from 'bootstrap-vue';
import googleUrl from '@/assets/json/googleUrl.json';
import {GoogleAccountContext} from '@/store/modules/accounts/state';

export default defineComponent({
  name: 'GoogleAccountCard',
  components: {BAlert},
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Object as PropType<GoogleAccountContext>,
      default: null,
    },
  },
  computed: {
    isConnected(): boolean {
      return Boolean(this.user?.connected);
    },
    authenticationUrl(): string|null {
      return typeof this.user?.authenticationUrl === 'string' && this.user.authenticationUrl
        ? this.user.authenticationUrl
        : null;
    },
  },
  methods: {
    refresh() {
      this.$router.go();
    },
  },
  googleUrl,
});
</script>
