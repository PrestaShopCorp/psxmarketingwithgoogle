<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled' : !isEnabled }"
  >
    <template
      v-if="!isEnabled"
    >
      <div
        class="d-flex align-items-center"
      >
        <img
          class="mr-3 rounded-circle"
          src="@/assets/images/google-icon-grey.svg"
          width="40"
          height="40"
        >
        <b-card-text
          class="text-left mb-0 ps_gs-fz-12"
        >
          {{ $t('googleAccountCard.introDisabled') }}
        </b-card-text>
      </div>
    </template>
    <template
      v-else
    >
      <div
        class="d-flex align-items-center"
      >
        <img
          class="mr-3 rounded-circle"
          src="@/assets/images/google-icon.svg"
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
      <div class="d-flex flex-wrap flex-md-nowrap justify-content-between mt-3">
        <p
          v-if="!accessToken"
          class="ps_gs-fz-12 mb-0"
        >
          {{ $t('googleAccountCard.introEnabled') }}
        </p>
        <div
          v-else
        >
          <img
            class="mr-3 rounded-circle"
            :src="user.details.picture"
            width="38"
            height="38"
            alt=""
          >
          <strong>{{ user.details.email }}</strong>
        </div>
        <div
          v-if="!accessToken"
          class="flex-grow-1 d-flex-md flex-md-grow-0 flex-shrink-0 text-center"
        >
          <b-button
            size="sm"
            variant="primary"
            class="mx-1 mt-3 mt-md-0 mr-md-0"
            :disabled="isConnecting || !authenticationUrl"
            @click="openPopup"
          >
            <template v-if="!isConnecting">
              {{ $t('cta.connectAccount') }}
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
            {{ $t('cta.dissociate') }}
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
    </template>
    <b-alert
      v-if="error"
      show
      variant="warning"
      class="mb-0 mt-3"
    >
      {{ error }}
    </b-alert>
  </b-card>
</template>

<script>
/**
 * TODO: Handle error cases (x2)
 * "Can't connect" and "Token missing"
 * When "Can't connect", CTA should be disabled
 */

import googleUrl from '@/assets/json/googleUrl.json';

import {
  BAlert,
} from 'bootstrap-vue';
import MutationsTypes from '../../store/modules/accounts/mutations-types';
import ActionsTypes from '../../store/modules/accounts/actions-types';
import Glass from '../commons/glass';
import {GoogleAccountContext} from '../../store/modules/accounts/state';

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
        return this.$i18n.t('googleAccountCard.alertCantConnect');
      }

      if (this.user
        && this.user.access_token
        && this.user.access_token instanceof Error
      ) {
        return this.$i18n.t('googleAccountCard.alertTokenMissing');
      }

      return null;
    },
  },
  methods: {
    changeAccount() {
      this.$store.dispatch('accounts/REQUEST_ROUTE_TO_GOOGLE_AUTH').then(() => {
        this.openPopup();
      }).catch(() => {
        // maybe display alert
      });
    },
    openPopup() {
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
          this.refreshAccount(true);
          window.removeEventListener('message', this.popupMessageListener);
        }
      });
      const p = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=450,height=628';
      this.popup = window.open(
        this.user.authenticationUrl,
        'ps_google_shopping_onboarding',
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
      this.$emit('dissociateGoogleAccount');
    },
  },
  googleUrl,
};
</script>

<style></style>
