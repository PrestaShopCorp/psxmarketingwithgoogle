<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled' : !isEnabled }"
  >
    <div
      class="d-md-flex flex-wrap align-items-center justify-content-between mb-3"
    >
      <div class="d-flex align-items-center">
        <img
          class="mr-3"
          :src="isEnabled ? require('@/assets/images/google-merchant-center-icon.svg') : require('@/assets/images/google-merchant-center-icon-grey.svg')"
          width="40"
          height="40"
        />
        <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
          Merchant Center account
        </b-card-text>
      </div>
    </div>
    <VueShowdown
      class="ps_gs-fz-12"
      :markdown="message"
      :extensions="['targetlink']"
    />
    <div
      v-if="!isEnabled"
      class="d-flex pt-2"
    >
      <span
        class="mr-2"
      >
        <b-icon-exclamation-circle></b-icon-exclamation-circle>
      </span>
      <ul class="list-inline mb-0">
        <li
          v-b-tooltip.hover
          title="Requires Google account configured"
          class="list-inline-item"
        ><b-badge variant="muted">Google account</b-badge></li>
      </ul>
    </div>
    <div v-else>
      <b-form>
        <p for="mcaSelection">
          <strong>Connect an existing Merchant Center account</strong>
        </p>
        <div class="d-md-flex text-center">
          <b-dropdown
            id="mcaSelection"
            ref="mcaSelection"
            :text="selected || 'Choose your account'"
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
              {{option.text}}
            </b-dropdown-item>
          </b-dropdown>
          <b-button
            variant="primary"
            :disabled="!selected"
            class="mt-3 mt-md-0 ml-md-3"
          >
            Choose existing account
          </b-button>
        </div>
      </b-form>
      <div class="mt-4">
        <a href="#"><i class="left material-icons mr-2" aria-hidden="true">person_add</i><span class="align-middle">Create new Merchant Center account</span></a>
        <VueShowdown
          class="mt-4 mb-0 text-muted ps_gs-fz-12"
          :markdown="$t('onboarding.mcaCard.footerEU')"
          :extensions="['targetlink']"
        />
      </div>
    </div>
  </b-card>
</template>

<script>
import { BIconstack, BIconCheck, BIconCircleFill, BIconExclamationCircle, BTooltip } from "bootstrap-vue";

export default {
  name: "MerchantCenterAccountCard",
  components: {
    BIconstack,
    BIconCheck,
    BIconCircleFill,
    BIconExclamationCircle,
    BTooltip
  },
  data() {
    return {
      selected: null,
      mcaSelectionOptions: [
        { text: 'V Godard - 123456789' },
        { text: 'Royer et fils - 653367900' },
        { text: 'Maison Royer - 246797534' },
        { text: 'Godard - 79747579864' },
        { text: 'Fondation Royer - 678321007' },
      ]
    }
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    message() {
      return this.isEnabled ? '[Google Merchant Center](//google.com){:target="_blank"} helps you get your store and product info into Google and make it available to shoppers across Google.' : 'Once connected your Google account you will be able to associate your Merchant Center account.' ;
    },
  },
  mounted() {
    this.isEnabled && this.$refs.mcaSelection.$refs.toggle.focus();
  },
};
</script>
