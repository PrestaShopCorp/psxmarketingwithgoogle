<template>
  <ps-modal
    id="MerchantCenterAccountPopinNewMca"
    :title="popinTitle"
    v-bind="$attrs"
    scrollable
    ref="modal"
  >
    <Stepper
      v-if="newMca"
      :steps="steps"
    />
    <form
      class="my-1"
      v-if="stepActiveData === 1"
    >
      <VueShowdown
        tag="legend"
        class="font-weight-normal ps_gs-fz-14 mb-2 bg-transparent border-0"
        :markdown="$t('mcaRequirements.legend')"
        :extensions="['no-p-tag']"
      />
      <b-alert
        v-if="!newMca"
        variant="warning"
        show
        class="my-3"
      >
        <p class="mb-0">
          {{ $t('mcaRequirements.alert') }}
        </p>
      </b-alert>
      <ul class="list-unstyled">
        <li
          v-for="requirement in requirements"
          :key="$t(`mcaRequirements.${requirement}.title`)"
          class="d-flex border-bottom py-3 pl-2 ml-1"
        >
          <b-form-checkbox
            class="ps_gs-checkbox"
            :id="safeString($t(`mcaRequirements.${requirement}.title`))"
            v-model="selectedRequirements"
            :value="requirement"
            :disabled="!newMca"
            @change="getCurrentCheckbox"
          >
            <div>
              <span
                class="ps_gs-fz-14 font-weight-normal mb-1"
              >
                {{ $t(`mcaRequirements.${requirement}.title`) }}
              </span>
              <p class="ps_gs-fz-12 text-muted">
                {{ $t(`mcaRequirements.${requirement}.description`) }}<br>
                <a
                  :href="$options.googleUrl[requirement]"
                  target="_blank"
                >
                  {{ $t(`mcaRequirements.${requirement}.link`) }}
                </a>
              </p>
            </div>
          </b-form-checkbox>
        </li>
      </ul>
    </form>
    <form
      class="my-1"
      v-else-if="stepActiveData === 2"
    >
      <section class="mb-3">
        <div class="d-flex align-items-center">
          <h3 class="h4 mb-0 font-weight-600">
            {{ $t('mcaRequirements.websiteURL') }}
          </h3>
          <b-button
            class="ml-1 p-0 d-flex"
            variant="text"
            v-b-tooltip:googleShoppingApp
            :title="$t('mcaRequirements.websiteURLDescription')"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12 text-primary">
              error_outline
            </span>
          </b-button>
        </div>
        <span class="d-block">
          {{ shopInformations.shop.url }}
        </span>
        <VueShowdown
          class="font-weight-normal ps_gs-fz-12 text-muted mb-3 pb-2"
          :markdown="$t('mcaRequirements.legend2')"
        />
      </section>
      <section class="mb-3">
        <div class="d-flex align-items-center">
          <h3 class="h4 mb-0 font-weight-600">
            {{ $t('mcaRequirements.storeName') }}
          </h3>
          <b-button
            class="ml-1 p-0 d-flex"
            variant="text"
            v-b-tooltip:googleShoppingApp
            :title="$t('mcaRequirements.storeNameDescription')"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12 text-primary">
              error_outline
            </span>
          </b-button>
        </div>
        <span class="d-block">
          {{ shopInformations.shop.name }}
        </span>
      </section>
      <section class="mb-3">
        <h3 class="h4 mb-0 font-weight-600">
          {{ $t('mcaRequirements.businessLocation') }}
        </h3>
        <span class="d-block">
          {{ shopInformations.store.country.iso_code }}
        </span>
      </section>
      <b-form-group
        :label="$t('mcaRequirements.businessAddress')"
        label-for="inputBusinessAddress"
        label-class="h4 mb-0 font-weight-600"
        content-cols="12"
      >
        <b-form-input
          id="inputBusinessAddress"
          :value="shopInformations.store.streetAddress"
          class="maxw-sm-420"
        />
      </b-form-group>
      <b-form-group
        :label="$t('mcaRequirements.businessPhone')"
        label-for="inputBusinessPhoneNumber"
        label-class="h4 mb-0 font-weight-600"
        content-cols="12"
      >
        <b-form-input
          id="inputBusinessPhoneNumber"
          :value="shopInformations.store.phone"
          class="maxw-sm-420"
        />
      </b-form-group>
      <div class="mb-4 pb-1">
        <div class="d-flex align-items-center">
          <legend
            class="d-block w-auto h4 mb-0 mr-2 font-weight-600 col-form-label
              bg-transparent border-0"
          >
            {{ $t('mcaRequirements.siteContainsAdultContent') }}
          </legend>
          <a
            :href="$options.googleUrl.policyAdultContent"
            target="_blank"
            class="text-muted ps_gs-fz-12"
          >
            {{ $t('mcaRequirements.seePolicyAdultContent') }}
          </a>
        </div>
        <b-form-group>
          <b-form-radio-group
            id="radio-group-2"
            name="radio-sub-component"
            v-model="containsAdultContent"
          >
            <b-form-radio :value="true">
              {{ $t('cta.yes') }}
            </b-form-radio>
            <b-form-radio :value="false">
              {{ $t('cta.no') }}
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </div>
      <div
        class="d-flex"
      >
        <b-form-checkbox
          class="ps_gs-checkbox"
          v-model="acceptsGoogleTerms"
        >
          <VueShowdown
            :markdown="$t('mcaRequirements.labelReadAndAgree', [
              this.$options.googleUrl.googleTermsAndPolicies,
              this.$options.googleUrl.googleMerchantCenterTermsOfService,
              this.$options.googleUrl.shoppingAdsPolicies,
              this.$options.googleUrl.googleAdsTermsAndConditions
            ])"
            :extensions="['targetlink']"
          />
        </b-form-checkbox>
      </div>
    </form>
    <template
      slot="modal-footer"
      v-if="stepActiveData === 1"
    >
      <a
        class="ps_gs-fz-12 text-muted mr-sm-auto"
        :href="$options.googleUrl.googleWebsiteRequirements"
        target="_blank"
      >
        {{ $t('mcaRequirements.footer') }}
      </a>
      <b-button
        v-if="newMca"
        variant="outline-secondary"
        @click="cancel()"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <span
        v-if="newMca"
        v-b-tooltip:googleShoppingApp
        :title="isStepOneReadyToValidate() ? $t('tooltip.mustCheckAllRequirements') : ''"
      >
        <b-button
          variant="primary"
          @click="saveFirstStep()"
          :disabled="isStepOneReadyToValidate()"
        >
          {{ $t('cta.storeMeetsRequirements') }}
        </b-button>
      </span>
      <!-- <b-button
        v-else
        variant="primary"
        @click="saveChangeExistingGmc()"
      >
        {{ $t('cta.save') }}
      </b-button> -->
    </template>
    <template
      slot="modal-footer"
      v-else-if="stepActiveData === 2"
    >
      <b-button
        variant="outline-secondary"
        @click="cancel()"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <span
        v-b-tooltip:googleShoppingApp
        :title="isStepTwoReadyToValidate() ? $t('tooltip.mustAgreeGoogleTerms') : ''"
      >
        <b-button
          variant="primary"
          @click="ok()"
          :disabled="isStepTwoReadyToValidate()"
        >
          {{ $t('cta.createAccount') }}
        </b-button>
      </span>
    </template>
  </ps-modal>
</template>

<script>
/**
 * TODO: Handle events (close, continue, etc...)
 * Handle Existing GMC, check requirements that are already checked
 * by filling the data.selectedRequirements[]
 */

import googleUrl from '@/assets/json/googleUrl.json';

import PsModal from '../commons/ps-modal';
import Stepper from '../commons/stepper';

export default {
  name: 'MerchantCenterAccountPopinWebsiteRequirements',
  components: {
    PsModal,
    Stepper,
  },
  data() {
    return {
      stepActiveData: 1,
      requirements: [
        'shoppingAdsPolicies',
        'accurateContactInformation',
        'secureCheckoutProcess',
        'returnPolicy',
        'billingTerms',
        'completeCheckoutProcess',
      ],
      selectedRequirements: [],
      steps: [
        {
          title: this.$i18n.t('mcaRequirements.steps.websiteRequirements'),
        },
        {
          title: this.$i18n.t('mcaRequirements.steps.shopInfo'),
        },
      ],
      businessPhone: this.infosBusinessPhone || '',
      shopInformations: {},
      containsAdultContent: null,
      acceptsGoogleTerms: false,
    };
  },
  methods: {
    safeString(str) {
      let newStr = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      newStr = newStr
        .replace(/-/g, ' ') // convert all hyphens to spaces
        .replace(/\s+/g, ''); // remove spaces
      return newStr;
    },
    isStepOneReadyToValidate() {
      return !(this.selectedRequirements.length === this.requirements.length);
    },
    isStepTwoReadyToValidate() {
      /**
       * TODO: Form step 2 validation
       * Adds businessAddress and businessPhoneto the validation
       */
      return !(this.acceptsGoogleTerms && (this.containsAdultContent != null));
    },
    saveFirstStep() {
      this.stepActiveData = 2;
    },
    getCurrentCheckbox() {
      this.$store.dispatch('accounts/SEND_WEBSITE_REQUIREMENTS', this.selectedRequirements);
    },
    ok() {
      this.$store.dispatch('accounts/SEND_WEBSITE_REQUIREMENTS', []);
    },
    cancel() {
      this.$refs.modal.hide();
    },
    saveChangeExistingGmc() {
      /**
       * TODO: Save change when existing GMC
       */
    },
  },
  props: {
    infosBusinessPhone: {
      type: String,
    },
    stepActive: {
      type: Number,
      default: 1,
    },
    newMca: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    popinTitle() {
      return this.newMca ? this.$i18n.t('mcaRequirements.title') : this.$i18n.t('mcaRequirements.steps.websiteRequirements');
    },
  },
  mounted() {
    this.stepActiveData = this.stepActive;
    if (this.newMca === true) {
      this.$store.dispatch('accounts/REQUEST_WEBSITE_REQUIREMENTS').then(() => {
        this.selectedRequirements = this.$store.getters['accounts/GET_WEBSITE_REQUIREMENTS'];
      });
      this.$store.dispatch('accounts/REQUEST_SHOP_INFORMATIONS').then(() => {
        this.shopInformations = this.$store.getters['accounts/GET_SHOP_INFORMATIONS'];
      });
    }
  },
  googleUrl,
};
</script>
