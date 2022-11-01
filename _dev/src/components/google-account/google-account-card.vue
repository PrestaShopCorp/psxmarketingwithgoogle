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
        class="ps_gs-onboardingcard p-3"
        :class="{ 'ps_gs-onboardingcard--disabled' : !isEnabled }"
      >
        <div
          class="d-flex align-items-center"
        >
          <img
            class="mr-3 rounded-circle"
            :src="
                isEnabled
                  ? require('@/assets/images/google-icon.svg')
                  : require('@/assets/images/google-icon-grey.svg')
            "
            width="40"
            height="40"
          >
          <b-card-text class="ps_gs-onboardingcard__title  text-left mb-0">
            {{ $t('googleAccountCard.title') }}
          </b-card-text>
          <i
            v-if="user && user.details.email"
            class="material-icons ps_gs-fz-22 ml-2 mr-3 mb-0 text-success align-bottom"
          >
            check_circle
          </i>
        </div>
        <div
          class="d-flex flex-wrap flex-md-nowrap
        justify-content-between align-items-center mt-3"
        >
          <p
            v-if="!accessToken"
            class="mb-0"
          >
            {{ $t('googleAccountCard.introEnabled') }}<br>
          </p>
          <div
            v-else
            class="d-flex align-items-center pt-3 pr-3 pb-3"
          >
            <img
              class="mr-3 rounded-circle"
              :src="user.details.picture"
              width="38"
              height="38"
              alt=""
            >
            <a
              :href="$options.googleUrl.manageGoogleAccount"
              :title="$t('cta.goToYourX', [$t('badge.googleAccount')])"
              target="_blank"
              class="external_link-no_icon link-regular text-break"
            >
              <strong>{{ user.details.email }}</strong>
            </a>
          </div>
          <div
            v-if="!accessToken"
            class="flex-grow-1 d-flex-md flex-md-grow-0 flex-shrink-0 text-center"
          >
            <b-button
              size="sm"
              variant="invisible"
              class="btn-google mx-1 mt-3 mt-md-0 mr-md-0 ml-md-3"
              :class="{'is-busy' : isConnecting}"
              :disabled="isConnecting || error === 'CantConnect'"
              @click="openPopup"
              data-test-id="btn-connect"
            >
              <template v-if="!isConnecting">
                {{ $t('cta.signInWithGoogle') }}
              </template>
              <template v-else>
                {{ $t('cta.connectingAccount') }}
                <span class="ml-1 icon-busy" />
              </template>
            </b-button>
            <glass
              v-if="popupClosingLooper"
              @close="closePopup"
              @forceFocus="focusPopup"
            />
          </div>
          <div
            v-else
            class="mx-auto d-flex-md mr-md-0 flex-md-shrink-0 text-center"
          >
            <b-button
              size="sm"
              variant="outline-secondary"
              class="mx-1 mt-3 mt-md-0"
              @click="dissociateGoogleAccount"
            >
              {{ $t('cta.disconnect') }}
            </b-button>
            <b-button
              size="sm"
              variant="outline-secondary"
              class="mx-1 mt-3 mt-md-0 mr-md-0"
              @click="changeAccount"
            >
              {{ $t('cta.manageAccount') }}
            </b-button>
            <glass
              v-if="popupClosingLooper"
              @close="closePopup"
              @forceFocus="focusPopup"
            />
          </div>
        </div>
        <div
          v-if="accessToken"
          class="text-md-right text-muted mt-3"
        >
          <p class="ps_gs-fz-12 mb-0">
            {{ $t('googleAccountCard.footerDissociating') }}
          </p>
        </div>
        <b-alert
          v-if="!error && !accessToken"
          show
          variant="info"
          class="mb-0 mt-3"
        >
          <VueShowdown
            tag="p"
            :extensions="['no-p-tag']"
            class="mb-0"
            :markdown="$t('googleAccountCard.alertInfo')"
          />
        </b-alert>
        <b-alert
          v-if="!error && accessToken && missingTokenScopes"
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <VueShowdown
            tag="p"
            :extensions="['no-p-tag']"
            class="mb-0"
            :markdown="$t('googleAccountCard.missingTokenScopes')"
          />
          <div
            class="d-md-flex text-center align-items-center mt-2"
          >
            <b-button
              size="sm"
              class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1"
              variant="outline-secondary"
              @click="changeAccount"
            >
              {{ $t('cta.manageAccount') }}
            </b-button>
          </div>
        </b-alert>
        <b-alert
          v-if="error"
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <p class="mb-0">
            {{ $t(`googleAccountCard.alert${error}`) }}
          </p>
          <div
            v-if="error === 'CantConnect'"
            class="d-md-flex text-center align-items-center mt-2"
          >
            <b-button
              size="sm"
              class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1"
              variant="outline-secondary"
              @click="refresh"
              data-test-id="btn-refresh"
            >
              {{ $t('general.refreshPage') }}
            </b-button>
          </div>
        </b-alert>
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script>
import {
  BAlert,
} from 'bootstrap-vue';
import googleUrl from '@/assets/json/googleUrl.json';

import MutationsTypes from '../../store/modules/accounts/mutations-types';
import ActionsTypes from '../../store/modules/accounts/actions-types';
import Glass from '../commons/glass';
import {GoogleAccountContext} from '../../store/modules/accounts/state';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'GoogleAccountCard',
  components: {
    Glass, BAlert,
  },
  data() {
    return {
      isConnecting: false,
      popup: null,
      popupMessageListener: null,
      popupClosingLooper: null,
    };
  },
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
      type: GoogleAccountContext,
      default: null,
    },
  },
  mounted() {
    if (this.isEnabled && !this.user) {
      this.refreshAccount(false);
    }
  },
  computed: {
    accessToken() {
      return this.user && this.user.access_token
        && typeof this.user.access_token === 'string'
        ? this.user.access_token
        : null;
    },
    authenticationUrl() {
      return this.user && this.user.authenticationUrl
        && typeof this.user.authenticationUrl === 'string'
        ? this.user.authenticationUrl
        : null;
    },
    error() {
      if (this.user
        && this.user.authenticationUrl
        && this.user.authenticationUrl instanceof Error
      ) {
        return 'CantConnect';
      }

      if (this.user
        && this.user.access_token
        && this.user.access_token instanceof Error
      ) {
        return 'TokenMissing';
      }

      return null;
    },
    missingTokenScopes() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT'].missingTokenScopes?.length;
    },
  },
  methods: {
    changeAccount() {
      this.$store.dispatch('accounts/REQUEST_ROUTE_TO_GOOGLE_AUTH').then(() => {
        this.openPopup(true);
        this.$segment.track('[GGL] Connect Google Account', {
          module: 'psxmarketingwithgoogle',
          params: SegmentGenericParams,
        });
      }).catch(() => {
        // TODO: maybe display alert
      });
    },
    openPopup(changeAccount) {
      if (this.popupMessageListener) {
        window.removeEventListener('message', this.popupMessageListener);
      }

      if (this.popupClosingLooper) {
        clearInterval(this.popupClosingLooper);
      }

      this.popupMessageListener = window.addEventListener('message', (event) => {
        const params = new URLSearchParams(event.data);
        const paramsFromGoogleCb = ['from', 'message', 'status'];
        const paramsFound = paramsFromGoogleCb.reduce((acc, x) => {
          acc[x] = params.get(x);
          return acc;
        },
        {},
        );

        if (paramsFound.from === 'SVC' && paramsFound.message === 'ok') {
          this.$store.commit(`accounts/${MutationsTypes.SET_GOOGLE_AUTHENTICATION_RESPONSE}`, paramsFound);
          if (changeAccount === true) { // don't cast here!
            // TODO: could be improoved to avoid full reload.
            //  Need to this.refreshAccount(true) AND refresh GMC details too !
            this.refresh();
          } else {
            this.refreshAccount(true);
            window.removeEventListener('message', this.popupMessageListener);
          }
        }
      });
      const p = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=450,height=628';
      this.popup = window.open(
        this.user.authenticationUrl,
        'psx_mktg_with_onboarding',
        p,
      );
      this.popup.focus();

      this.popupClosingLooper = setInterval(() => {
        if (this.popup && (this.popup.closed === true)) {
          if (this.popupClosingLooper) {
            clearInterval(this.popupClosingLooper);
            this.popupClosingLooper = null;
          }
        }
      }, 750);
    },
    closePopup() {
      if (this.popup) {
        this.popup.close();
      }
      if (this.popupClosingLooper) {
        clearInterval(this.popupClosingLooper);
        this.popupClosingLooper = null;
      }
    },
    focusPopup() {
      if (this.popup) {
        this.popup.focus();
      } else {
        this.openPopup();
      }
    },
    async refreshAccount(errorIfNot) {
      this.isConnecting = true;
      try {
        const res = await this.$store.dispatch(`accounts/${ActionsTypes.REQUEST_GOOGLE_ACCOUNT_DETAILS}`);

        if (errorIfNot && !res) {
          throw new Error();
        }
        this.$emit('connectGoogleAccount');
      } catch (err) {
        // TODO: display error message
        console.error(err);
      } finally {
        this.isConnecting = false;
      }
    },
    dissociateGoogleAccount() {
      this.$segment.track('[GGL] Disconnect Google Account', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.$emit('dissociateGoogleAccount');
    },
    refresh() {
      this.$router.go();
    },
  },
  googleUrl,
};
</script>
