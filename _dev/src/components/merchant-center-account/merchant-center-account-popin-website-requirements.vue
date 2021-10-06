<template>
  <ps-modal
    id="MerchantCenterAccountPopinNewMca"
    :title="popinTitle"
    v-bind="$attrs"
    @close="cancel"
    ref="modal"
    footer-class="flex-sm-nowrap"
    size="xl"
  >
    <Stepper
      v-if="newMca"
      :active-step="stepActiveData"
      :steps="steps()"
      @changeStep="stepToChange($event)"
    />

    <Step1
      v-if="stepActiveData === 1"
      :new-mca="newMca"
      @stepOneValidation="stepOneValidation"
    />

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
            v-b-tooltip:psxMktgWithGoogleApp
            :title="$t('mcaRequirements.websiteURLDescription')"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12 text-primary">
              info_outlined
            </span>
          </b-button>
        </div>
        <span class="d-block">
          {{ shopInformations.shop.url }}
        </span>
        <VueShowdown
          class="font-weight-normal ps_gs-fz-12 text-muted mb-3 pb-2"
          :markdown="$t('mcaRequirements.legend2')"
          :extensions="['extended-link']"
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
            v-b-tooltip:psxMktgWithGoogleApp
            :title="$t('mcaRequirements.storeNameDescription')"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12 text-primary">
              info_outlined
            </span>
          </b-button>
        </div>
        <span class="d-block">
          {{ shopInformations.shop.name }}
        </span>
      </section>

      <section class="mb-3">
        <div class="d-flex align-items-center">
          <h3 class="h4 mb-0 font-weight-600">
            {{ $t('mcaRequirements.businessAddress') }}
          </h3>
          <b-button
            class="ml-1 p-0 d-flex"
            variant="text"
            v-b-tooltip:psxMktgWithGoogleApp
            :title="$t('tooltip.GMCForm.businessAddress')"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12 text-primary">
              info_outlined
            </span>
          </b-button>
        </div>
        <span class="d-block">
          {{ shopInformations.store.streetAddress
            ? shopInformations.store.streetAddress : '--' }}
        </span>

        <p
          class="mb-0 text-danger text-left ps_gs-fz-12"
          v-if="!shopInformations.store.streetAddress"
        >
          {{ $t('general.XIsMandatory', [$t('mcaRequirements.businessAddress')]) }}
        </p>

        <VueShowdown
          id="businessAddressFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changeAddressField', [storeInformationsUrl])"
        />
      </section>

      <section class="mb-3">
        <div class="d-flex align-items-center">
          <h3 class="h4 mb-0 font-weight-600">
            {{ $t('mcaRequirements.businessZipCode') }}
          </h3>
          <b-button
            class="ml-1 p-0 d-flex"
            variant="text"
            v-b-tooltip:psxMktgWithGoogleApp
            :title="$t('tooltip.GMCForm.businessZipCode')"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12 text-primary">
              info_outlined
            </span>
          </b-button>
        </div>
        <span class="d-block">
          {{ shopInformations.store.postalCode
            ? shopInformations.store.postalCode : '--' }}
        </span>

        <p
          class="mb-0 text-danger text-left ps_gs-fz-12"
          v-if="!shopInformations.store.postalCode"
        >
          {{ $t('general.XIsMandatory', [$t('mcaRequirements.businessZipCode')]) }}
        </p>

        <VueShowdown
          id="businessZipCodeFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changeZipCodeField', [storeInformationsUrl])"
        />
      </section>

      <section class="mb-3">
        <div class="d-flex align-items-center">
          <h3 class="h4 mb-0 font-weight-600">
            {{ $t('mcaRequirements.businessCity') }}
          </h3>
          <b-button
            class="ml-1 p-0 d-flex"
            variant="text"
            v-b-tooltip:psxMktgWithGoogleApp
            :title="$t('tooltip.GMCForm.businessCity')"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12 text-primary">
              info_outlined
            </span>
          </b-button>
        </div>
        <span class="d-block">
          {{ shopInformations.store.locality
            ? shopInformations.store.locality : '--' }}
        </span>

        <p
          class="mb-0 text-danger text-left ps_gs-fz-12"
          v-if="!shopInformations.store.locality"
        >
          {{ $t('general.XIsMandatory', [$t('mcaRequirements.businessCity')]) }}
        </p>

        <VueShowdown
          id="businessCityFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changeCityField', [storeInformationsUrl])"
        />
      </section>

      <section class="mb-3">
        <div class="d-flex align-items-center">
          <h3 class="h4 mb-0 font-weight-600">
            {{ $t('mcaRequirements.businessCountry') }}
          </h3>
          <b-button
            class="ml-1 p-0 d-flex"
            variant="text"
            v-b-tooltip:psxMktgWithGoogleApp
            :title="$t('tooltip.GMCForm.businessCountry')"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12 text-primary">
              info_outlined
            </span>
          </b-button>
        </div>
        <span class="d-block">
          {{ shopInformations.store.country.name
            ? shopInformations.store.country.name : '--' }}
        </span>

        <p
          class="mb-0 text-danger text-left ps_gs-fz-12"
          v-if="!shopInformations.store.country.name"
        >
          {{ $t('general.XIsMandatory', [$t('mcaRequirements.businessCountry')]) }}
        </p>

        <VueShowdown
          id="businessCountryFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changeCountryField', [storeInformationsUrl])"
        />
      </section>

      <section
        class="mb-3"
        v-if="Object.prototype.hasOwnProperty.call(shopInformations.store, 'region')"
      >
        <div class="d-flex align-items-center">
          <h3 class="h4 mb-0 font-weight-600">
            {{ $t('mcaRequirements.businessRegion') }}
          </h3>
          <b-button
            class="ml-1 p-0 d-flex"
            variant="text"
            v-b-tooltip:psxMktgWithGoogleApp
            :title="$t('tooltip.GMCForm.businessRegion')"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12 text-primary">
              info_outlined
            </span>
          </b-button>
        </div>
        <span class="d-block">
          {{ shopInformations.store.region
            ? shopInformations.store.region : '--' }}
        </span>

        <p
          class="mb-0 text-danger text-left ps_gs-fz-12"
          v-if="!shopInformations.store.region"
        >
          {{ $t('general.XIsMandatory', [$t('mcaRequirements.businessRegion')]) }}
        </p>

        <VueShowdown
          id="businessRegionFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changeRegionField', [storeInformationsUrl])"
        />
      </section>

      <section class="mb-3">
        <div class="d-flex align-items-center">
          <h3 class="h4 mb-0 font-weight-600">
            {{ $t('mcaRequirements.businessPhone') }}
          </h3>
          <b-button
            class="ml-1 p-0 d-flex"
            variant="text"
            v-b-tooltip:psxMktgWithGoogleApp
            :title="$t('tooltip.GMCForm.businessPhone')"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12 text-primary">
              info_outlined
            </span>
          </b-button>
        </div>
        <span class="d-block">
          {{ shopInformations.store.phone
            ? shopInformations.store.phone : '--' }}
        </span>

        <p
          class="mb-0 text-danger text-left ps_gs-fz-12"
          v-if="!shopInformations.store.phone"
        >
          {{ $t('general.XIsMandatory', [$t('mcaRequirements.businessPhone')]) }}
        </p>
        <p
          class="mb-0 text-danger text-left ps_gs-fz-12"
          v-if="!verifyPhone()"
        >
          {{ $t('mcaRequirements.phoneFormat') }}
        </p>

        <VueShowdown
          id="businessPhoneNumberFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changePhoneNumberField', [storeInformationsUrl])"
        />
      </section>

      <div class="mb-4 pb-1">
        <div class="d-sm-flex align-items-center">
          <legend
            class="d-block w-auto h4 mb-0 mr-2 font-weight-600 col-form-label
              bg-transparent border-0"
          >
            {{ $t('mcaRequirements.siteContainsAdultContent') }}
          </legend>
          <a
            :href="$options.googleUrl.policyAdultContent"
            target="_blank"
            class="d-inline-block text-muted ps_gs-fz-12 mb-2 mb-sm-0"
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
            :extensions="['extended-link']"
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
        v-b-tooltip:psxMktgWithGoogleApp
        :title="isBtnStepOneDisabled ? $t('tooltip.mustCheckAllRequirements') : ''"
      >
        <b-button
          variant="primary"
          @click="saveFirstStep()"
          :disabled="isBtnStepOneDisabled"
        >
          {{ $t('cta.storeMeetsRequirements') }}
        </b-button>
      </span>
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
      <div
        class="flex-shrink-0"
        v-b-tooltip:psxMktgWithGoogleApp
        :title="isStepTwoReadyToValidate() ? $t('tooltip.mustAgreeGoogleTerms') : ''"
      >
        <b-button
          variant="primary"
          @click="ok()"
          :disabled="isStepTwoReadyToValidate()"
        >
          {{ $t('cta.createAccount') }}
        </b-button>
      </div>
    </template>
  </ps-modal>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';
import PsModal from '../commons/ps-modal';
import Stepper from '../commons/stepper';
import Step1 from './website-requirements/step-requirements';
import WebsiteRequirementsSteps from '@/enums/stepper/website-requirements-steps';

export default {
  name: 'MerchantCenterAccountPopinWebsiteRequirements',
  components: {
    PsModal,
    Stepper,
    Step1,
  },
  data() {
    return {
      stepActiveData: 1,
      containsAdultContent: null,
      acceptsGoogleTerms: false,
      isBtnStepOneDisabled: true,
    };
  },
  props: {
    stepActive: {
      type: Number,
      default: 1,
    },
    newMca: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    steps() {
      const steps = [];
      Object.keys(WebsiteRequirementsSteps).forEach((key) => {
        steps.push({
          title: this.$i18n.t(`mcaRequirements.steps.${WebsiteRequirementsSteps[key]}`),
        });
      });

      return steps;
    },
    stepOneValidation(payload) {
      this.isBtnStepOneDisabled = payload;
    },
    isStepTwoReadyToValidate() {
      return !(
        this.acceptsGoogleTerms
        && (this.containsAdultContent != null)
        && this.allFieldsAreFilled()
      );
    },
    allFieldsAreFilled() {
      let validate = !!(
        this.shopInformations.store.phone
        && this.shopInformations.store.streetAddress
        && this.shopInformations.store.postalCode
        && this.shopInformations.store.locality
      );
      if (this.shopInformations.store.region !== undefined
        && !this.shopInformations.store.region) {
        validate = false;
      }

      return validate;
    },
    saveFirstStep() {
      this.stepActiveData = 2;
    },
    stepToChange(value) {
      this.stepActiveData = value;
    },
    verifyPhone() {
      return !!(this.shopInformations.store.phone && this.shopInformations.store.phone.match(/^[+0-9. ()/-]*$/));
    },
    ok() {
      const payload = {
        shop_url: this.shopInformations.shop.url,
        shop_name: this.shopInformations.shop.name,
        location: this.shopInformations.store.country.iso_code,
        adult_content: this.containsAdultContent,
        address: this.shopInformations.store.streetAddress,
        phone: this.shopInformations.store.phone,
        postal_code: this.shopInformations.store.postalCode,
        locality: this.shopInformations.store.locality,
      };

      if (this.shopInformations.store?.region) {
        payload.region = this.shopInformations.store.region;
      }

      this.$store.dispatch('accounts/REQUEST_TO_SAVE_NEW_GMC', payload).then(() => {
        this.$refs.modal.hide();
      });
    },
    cancel() {
      this.$refs.modal.hide();
      this.stepActiveData = 1;
    },
    saveChangeExistingGmc() {
      /**
       * TODO: Save change when existing GMC
       */
    },
  },
  computed: {
    popinTitle() {
      return this.newMca ? this.$i18n.t('mcaRequirements.title') : this.$i18n.t('mcaRequirements.steps.websiteRequirements');
    },
    shopInformations() {
      return this.$store.getters['accounts/GET_SHOP_INFORMATIONS'];
    },
    storeInformationsUrl() {
      return this.$store.getters['app/GET_STORE_INFORMATION_URL'];
    },
  },
  mounted() {
    this.stepActiveData = this.stepActive;
    if (this.newMca === true) {
      this.$store.dispatch('accounts/REQUEST_WEBSITE_REQUIREMENTS').then(() => {
        this.selectedRequirements = this.$store.getters['accounts/GET_WEBSITE_REQUIREMENTS'];
      });
      this.$store.dispatch('accounts/REQUEST_SHOP_INFORMATIONS');
    }
  },
  googleUrl,
};
</script>
