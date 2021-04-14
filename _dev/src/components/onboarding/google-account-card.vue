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
          When you are done connecting your PrestaShop account
          you will be able to connect your Google accounts.
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
          Google account
        </b-card-text>
        <b-iconstack
          v-if="isConnected"
          font-scale="1.5"
          class="mx-3"
          width="20"
          height="20"
        >
          <b-icon-circle-fill
            stacked
            class="color-green"
          />
          <b-icon-check
            stacked
            variant="white"
          />
        </b-iconstack>
      </div>
      <div class="d-flex flex-wrap flex-md-nowrap justify-content-between mt-3">
        <p class="ps_gs-fz-12 mb-0">
          A Google Account lets you access your Google Merchant Center and Google Ads accounts
        </p>
        <div
          v-if="!isConnected"
          class="flex-grow-1 d-flex-md flex-md-grow-0 flex-shrink-0 text-center"
        >
          <b-button
            variant="primary"
            class="mx-2 mt-3 mt-md-0 mr-md-0"
            target="_blank"
            @click="connectGoogleAccount"
          >
            <template v-if="!isConnecting">
              Connect account
            </template>
            <template v-else>
              Connecting account...
              <span class="ml-1 icon-busy" />
            </template>
          </b-button>
        </div>
        <div
          v-else
          class="mx-auto d-flex-md mr-md-0 flex-md-shrink-0 text-center"
        >
          <b-button
            variant="outline-secondary"
            class="mx-2 mt-3 mt-md-0"
            target="_blank"
          >
            Dissociate
          </b-button>
          <b-button
            variant="outline-secondary"
            class="mx-2 mt-3 mt-md-0 mr-md-0"
            target="_blank"
          >
            Manage account
          </b-button>
        </div>
      </div>
      <div
        v-if="isConnected"
        class="text-md-right text-muted mt-3"
      >
        <p class="ps_gs-fz-12 mb-0">
          Dissociating your Google account will disconnect
          your Google Merchant Center and your Google Ads accounts.
        </p>
      </div>
    </template>
  </b-card>
</template>

<script>

import {
  BIconstack,
  BIconCheck,
  BIconCircleFill,
} from 'bootstrap-vue';

export default {
  name: 'GoogleAccountCard',
  components: {
    BIconstack, BIconCheck, BIconCircleFill,
  },
  data() {
    return {
      isConnecting: false,
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    connectGoogleAccount() {
      this.$emit('connectGoogleAccount');
      this.isConnecting = true;
    },
  },
};
</script>

<style></style>
