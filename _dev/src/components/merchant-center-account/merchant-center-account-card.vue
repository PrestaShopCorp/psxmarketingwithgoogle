<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled': !isEnabled }"
  >
    <div class="d-md-flex flex-wrap align-items-center justify-content-between mb-3">
      <div class="d-flex align-items-center">
        <img
          class="mr-3"
          :src="
            isEnabled
              ? require('@/assets/images/google-merchant-center-icon.svg')
              : require('@/assets/images/google-merchant-center-icon-grey.svg')
          "
          width="40"
          height="40"
          alt=""
        >
        <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
          {{ $t('mcaCard.title') }}
          <b-iconstack
            v-if="mcaConfigured && !error"
            font-scale="1.5"
            class="ml-2 mr-3 fixed-size color-green"
            width="20"
            height="20"
          >
            <b-icon-circle-fill stacked />
            <b-icon-check
              stacked
              variant="white"
            />
          </b-iconstack>
        </b-card-text>
      </div>
    </div>
    <VueShowdown
      v-if="selectedMcaDetails.id === null"
      class="ps_gs-fz-12 mb-3"
      :markdown="message"
      :extensions="['targetlink']"
    />
    <div
      v-if="!isEnabled"
      class="d-flex pt-2"
    >
      <span class="mr-2">
        <b-icon-exclamation-circle />
      </span>
      <ul class="list-inline mb-0">
        <li
          v-b-tooltip:googleShoppingApp
          :title="$t('tooltip.googleAccountRequired')"
          class="list-inline-item"
        >
          <b-badge variant="muted">
            {{ $t('badge.googleAccount') }}
          </b-badge>
        </li>
      </ul>
    </div>
    <div v-if="isEnabled && selectedMcaDetails.id === null">
      <b-form class="mb-2">
        <legend
          class="mb-1 h4 font-weight-600 bg-transparent border-0"
        >
          {{ $t('mcaCard.labelSelect') }}
        </legend>
        <div class="d-md-flex text-center">
          <b-dropdown
            id="mcaSelection"
            ref="mcaSelection"
            :text="mcaLabel(selectedMcaIndex) || $t('cta.chooseAccount')"
            variant=" "
            class="flex-grow-1 ps-dropdown ps_googleshopping-dropdown bordered"
            menu-class="ps-dropdown"
            no-flip
            size="sm"
          >
            <b-dropdown-item
              v-for="(option, index) in mcaSelectionOptions"
              :key="option.id"
              @click="selectedMcaIndex = index"
            >
              {{ mcaLabel(index) }}
            </b-dropdown-item>
          </b-dropdown>
          <b-button
            size="sm"
            variant="primary"
            :disabled="selectedMcaIndex === null"
            class="mt-3 mt-md-0 ml-md-3"
            @click="selectMerchantCenterAccount"
          >
            {{ $t('cta.chooseExistingAccount') }}
          </b-button>
        </div>
      </b-form>
      <div class="mt-3">
        <a href="#">
          <i
            class="left material-icons mr-2"
            aria-hidden="true"
          >person_add</i>
          <span class="align-middle">{{ $t('cta.createNewMCA') }}</span>
        </a>
        <VueShowdown
          v-if="isEU"
          class="mt-4 mb-0 text-muted ps_gs-fz-12"
          :markdown="$t('mcaCard.footerEU')"
          :extensions="['targetlink']"
        />
      </div>
    </div>
    <!--
      ToDo: Consider moving the "associated state" in a dedicated component
      As we only use data from the vuex store
    -->
    <div
      v-if="isEnabled && selectedMcaDetails.id !== null"
      class="d-flex flex-wrap flex-md-nowrap justify-content-between"
    >
      <div class="d-flex align-items-center">
        <strong>{{ selectedMcaDetails.name }} - {{ selectedMcaDetails.id }}</strong>
        <b-badge
          class="mx-3"
          :variant="mcaStatusBadge.color"
        >
          {{ $t(`badge.${mcaStatusBadge.text}`) }}
        </b-badge>
        <span
          v-if="mcaConfigured === false"
          class="text-muted"
        >
          <i class="icon-busy icon-busy--dark mr-1" />
          {{ $t('badge.checkingSiteClaim') }}
        </span>
        <span
          v-if="displaySiteVerified"
          class="text-muted"
        >

          <i class="material-icons mr-1 ps_gs-fz-12 text-success">done</i>
          {{ $t('badge.siteVerified') }}
        </span>
      </div>
      <div
        class="mx-auto d-flex-md mr-md-0 flex-md-shrink-0 text-center"
      >
        <b-button
          class="mx-1 mt-3 mt-md-0"
          size="sm"
          variant="outline-secondary"
          @click="checkWebsiteRequirements"
        >
          {{ $t("cta.checkRequirements") }}
        </b-button>
        <b-button
          class="mx-1 mt-3 mt-md-0 mr-md-0"
          size="sm"
          variant="outline-secondary"
          @click="dissociateMerchantCenterAccount"
        >
          {{ $t("cta.dissociate") }}
        </b-button>
      </div>
    </div>
    <b-alert
      v-if="error === WebsiteClaimErrorReason.Disapproved"
      show
      variant="danger"
      class="mb-0 mt-3"
    >
      <p class="mb-0">
        <!-- not translated, in need to be dynamic -->
        This is a danger alert with a link.
        <a
          href="//google.com"
          target="_blank"
          class="text-muted ps_gs-fz-12 font-weight-normal"
        >
          {{ $t('cta.learnAboutAccountSuspension') }}
        </a>
      </p>
    </b-alert>
    <b-alert
      v-else-if="error === WebsiteClaimErrorReason.Expiring"
      show
      variant="warning"
      class="mb-0 mt-3"
    >
      <p class="mb-0">
        <!-- not translated, in need to be dynamic -->
        This is a warning alert with a link.
        <a
          href="//google.com"
          target="_blank"
          class="text-muted ps_gs-fz-12 font-weight-normal"
        >
          {{ $t('cta.learnAboutAccountSuspension') }}
        </a>
      </p>
    </b-alert>
    <b-alert
      v-else-if="error === WebsiteClaimErrorReason.Overwrite"
      show
      variant="warning"
      class="mb-0 mt-3"
    >
      <p class="mb-0">
        <strong>{{ $t('mcaCard.claimCollides') }}</strong><br>
        <span class="ps_gs-fz-12">
          {{ $t('mcaCard.claimOverwrite') }}
        </span>
      </p>
      <div class="d-md-flex text-center align-items-center mt-2">
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1"
          variant="secondary"
        >
          {{ $t("cta.overwriteClaim") }}
        </b-button>
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 mr-md-3"
          variant="outline-secondary"
        >
          {{ $t("cta.switchAccount") }}
        </b-button>
        <a
          href="//google.com"
          target="_blank"
          class="d-inline-block text-muted ps_gs-fz-12 font-weight-normal mt-3 mt-md-0"
        >
          {{ $t('cta.learnAboutSiteClaiming') }}
        </a>
      </div>
    </b-alert>
    <b-alert
      v-else-if="error === WebsiteClaimErrorReason.ShopInfoMissing"
      show
      variant="warning"
      class="mb-0 mt-3"
    >
      <p class="mb-0">
        <strong>{{ $t('mcaCard.shopInfoMissing') }}</strong><br>
        <span class="ps_gs-fz-12">
          {{ $t('mcaCard.shopInfoMissingDescription') }}
        </span><br>
        <a
          class="ps_gs-fz-12 text-muted"
          :href="$options.googleUrl.loginMCA"
          target="_blank"
        >
          {{ $options.googleUrl.loginMCA }}
        </a>
      </p>
    </b-alert>
  </b-card>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';

import {
  BIconstack,
  BIconCheck,
  BIconCircleFill,
  BIconExclamationCircle,
} from 'bootstrap-vue';

import {
  WebsiteClaimErrorReason,
} from '../../store/modules/accounts/state';

export default {
  name: 'MerchantCenterAccountCard',
  components: {
    BIconstack,
    BIconCheck,
    BIconCircleFill,
    BIconExclamationCircle,
  },
  data() {
    return {
      selectedMcaIndex: null,
      WebsiteClaimErrorReason,
      displaySiteVerified: false,
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String, // Possible values in type WebsiteClaimErrorReason,
      default: null,
    },
    isEU: {
      type: Boolean,
    },
  },
  computed: {
    mcaSelectionOptions() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_MCA_LIST'];
    },
    mcaConfigured() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED'];
    },
    selectedMcaDetails() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT'];
    },
    message() {
      return this.isEnabled
        ? this.$i18n.t('mcaCard.introEnabled')
        : this.$i18n.t('mcaCard.introDisabled');
    },
    mcaStatusBadge() {
      switch (this.error) {
        case WebsiteClaimErrorReason.Pending:
          return {
            color: 'warning',
            text: 'pending',
          };
        case WebsiteClaimErrorReason.Expiring:
          return {
            color: 'warning',
            text: 'expiring',
          };
        case WebsiteClaimErrorReason.Disapproved:
          return {
            color: 'danger',
            text: 'disapproved',
          };
        case WebsiteClaimErrorReason.Overwrite:
        default:
          return {
            color: 'success',
            text: 'active',
          };
      }
    },
  },
  methods: {
    selectMerchantCenterAccount() {
      this.$emit('selectMerchantCenterAccount', this.mcaSelectionOptions[this.selectedMcaIndex]);
    },
    dissociateMerchantCenterAccount() {
      this.$emit('dissociateMerchantCenterAccount');
    },
    mcaLabel(index) {
      if (this.mcaSelectionOptions[index]) {
        return `${this.mcaSelectionOptions[index].name} - ${this.mcaSelectionOptions[index].id}`;
      }
      return null;
    },
    checkWebsiteRequirements() {
      /**
       * TODO: Handle opening of Popup */
    },
  },
  mounted() {
    if (this.$refs.mcaSelection) {
      this.$refs.mcaSelection.$refs.toggle.focus();
    }
  },
  watch: {
    mcaConfigured(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        this.displaySiteVerified = true;
        setTimeout(() => {
          this.displaySiteVerified = false;
        }, 2000);
      }
    },
  },
  googleUrl,
};
</script>
