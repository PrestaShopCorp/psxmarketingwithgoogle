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
        />
        <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
          Merchant Center account
          <b-iconstack
            v-if="mcaConfigured"
            font-scale="1.5"
            class="ml-2 mr-3 fixed-size color-green"
            width="20"
            height="20"
          >
            <b-icon-circle-fill stacked />
            <b-icon-check stacked variant="white" />
          </b-iconstack>
        </b-card-text>
      </div>
    </div>
    <VueShowdown
      v-if="!websiteVerification"
      class="ps_gs-fz-12 mb-3"
      :markdown="message"
      :extensions="['targetlink']"
    />
    <div v-if="!isEnabled" class="d-flex pt-2">
      <span class="mr-2">
        <b-icon-exclamation-circle />
      </span>
      <ul class="list-inline mb-0">
        <li
          v-b-tooltip.hover
          title="Requires Google account configured"
          class="list-inline-item"
        >
          <b-badge variant="muted"> Google account </b-badge>
        </li>
      </ul>
    </div>
    <div v-if="isEnabled && !websiteVerification">
      <b-form class="mb-2">
        <p for="mcaSelection" class="mb-0">
          <strong>Connect an existing Merchant Center account</strong>
        </p>
        <div class="d-md-flex text-center">
          <b-dropdown
            id="mcaSelection"
            ref="mcaSelection"
            :text="selected || 'Choose your account'"
            variant=" "
            class="flex-grow-1 ps-dropdown ps_googleshopping-dropdown bordered"
            menu-class="ps-dropdown"
            no-flip
          >
            <b-dropdown-item
              v-for="option in mcaSelectionOptions"
              :key="option.text"
              @click="selected = option.text"
            >
              {{ option.text }}
            </b-dropdown-item>
          </b-dropdown>
          <b-button
            variant="primary"
            :disabled="!selected"
            class="mt-3 mt-md-0 ml-md-3"
            @click="selectMerchantCenterAccount"
          >
            Choose existing account
          </b-button>
        </div>
      </b-form>
      <div class="mt-3">
        <a href="#">
          <i class="left material-icons mr-2" aria-hidden="true"> person_add </i>
          <span class="align-middle"> Create new Merchant Center account </span>
        </a>
        <VueShowdown
          class="mt-4 mb-0 text-muted ps_gs-fz-12"
          :markdown="$t('onboarding.mcaCard.footerEU')"
          :extensions="['targetlink']"
        />
      </div>
    </div>
    <div
      v-if="isEnabled && websiteVerification"
      class="mt-2 d-flex justify-content-between align-items-start"
    >
      <div class="d-flex align-items-center">
        <strong>Maison Royer - 246797534</strong>
        <b-badge v-if="mcaStatus == 'active'" class="mx-3" variant="success">
          Active
        </b-badge>
        <b-badge v-if="mcaStatus == 'warning'" class="mx-3" variant="warning">
          Pending
        </b-badge>
        <b-badge v-if="mcaStatus == 'danger'" class="mx-3" variant="danger">
          Disapproved
        </b-badge>
        <span v-if="websiteVerification == 'checking'" class="text-muted">
          <i class="icon-busy icon-busy--dark mr-1"></i>
          Checking your site claim...
        </span>
        <span v-if="websiteVerification == 'doneAlert'" class="text-muted">
          <i class="material-icons mr-1 ps_gs-fz-12 text-success">done</i>
          Site verified
        </span>
      </div>
      <b-button variant="outline-secondary">
        {{ $t("cta.dissociate") }}
      </b-button>
    </div>
    <div v-if="isEnabled && error" class="mt-2">
      <b-alert v-if="error == 'disapproved'" show variant="danger" class="mb-0">
        <p class="mb-0">
          This is a danger alert with a link.
          <a
            href="//google.com"
            target="_blank"
            class="text-muted ps_gs-fz-12 font-weight-normal"
            >Learn about account suspension</a
          >
        </p>
      </b-alert>
      <b-alert v-else-if="error == 'expiring'" show variant="warning" class="mb-0">
        <p class="mb-0">
          This is a warning alert with a link.
          <a
            href="//google.com"
            target="_blank"
            class="text-muted ps_gs-fz-12 font-weight-normal"
            >Learn about account suspension</a
          >
        </p>
      </b-alert>
      <b-alert v-else-if="error == 'overwrite'" show variant="warning" class="mb-0">
        <p class="mb-0">
          <strong>Your current website claim collides with an existing claim</strong
          ><br />
          <span class="ps_gs-fz-12">
            To finalize your Google Merchant Center account creation, you need to
            overwrite the existing claim.
          </span>
        </p>
        <div class="d-md-flex text-center align-items-center mt-2">
          <b-button class="mx-3 mt-3 mt-md-0 mx-md-0" variant="secondary">
            {{ $t("cta.overwriteClaim") }}
          </b-button>
          <b-button class="mx-3 mt-3 mt-md-0" variant="outline-secondary">
            {{ $t("cta.switchAccount") }}
          </b-button>
          <a
            href="//google.com"
            target="_blank"
            class="d-inline-block text-muted ps_gs-fz-12 font-weight-normal mt-3 mt-md-0"
          >
            Learn about site claiming
          </a>
        </div>
      </b-alert>
    </div>
  </b-card>
</template>

<script>
import {
  BIconstack,
  BIconCheck,
  BIconCircleFill,
  BIconExclamationCircle,
} from "bootstrap-vue";

export default {
  name: "MerchantCenterAccountCard",
  components: {
    BIconstack,
    BIconCheck,
    BIconCircleFill,
    BIconExclamationCircle,
  },
  data() {
    return {
      mcaConfigured: false,
      selected: null,
      mcaSelectionOptions: [
        {
          text: "V Godard - 123456789",
        },
        {
          text: "Royer et fils - 653367900",
        },
        {
          text: "Maison Royer - 246797534",
        },
        {
          text: "Godard - 79747579864",
        },
        {
          text: "Fondation Royer - 678321007",
        },
      ],
      websiteVerification: null,
      mcaStatus: null,
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    error: String,
  },
  computed: {
    message() {
      return this.isEnabled
        ? '[Google Merchant Center](//google.com){:target="_blank"} helps you get your store and product info into Google and make it available to shoppers across Google.'
        : "Once connected your Google account you will be able to associate your Merchant Center account.";
    },
  },
  methods: {
    selectMerchantCenterAccount() {
      this.websiteVerification = "checking";
      this.mcaStatus = "active";
      setTimeout(() => {
        this.websiteVerification = "doneAlert";
        this.mcaConfigured = true;
        setTimeout(() => {
          this.websiteVerification = "done";
        }, 2000);
      }, 2000);
    },
  },
  mounted() {
    return this.isEnabled && this.$refs.mcaSelection.$refs.toggle.focus();
  },
};
</script>
