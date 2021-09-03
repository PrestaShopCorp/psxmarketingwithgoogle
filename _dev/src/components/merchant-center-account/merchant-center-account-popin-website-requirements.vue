<template>
  <ps-modal
    id="MerchantCenterAccountPopinNewMca"
    :title="popinTitle"
    v-bind="$attrs"
    @close="cancel"
    ref="modal"
    footer-class="flex-sm-nowrap"
  >
    <Stepper
      v-if="newMca"
      :active-step="stepActiveData"
      :steps="steps"
      @changeStep="stepToChange($event)"
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
        variant="info"
        show
        class="mt-3 mb-2"
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
          <component
            :is="newMca ? 'b-form-checkbox' : 'div'"
            class="ps_gs-checkbox"
            :class="{'d-flex': !newMca}"
            :id="safeString($t(`mcaRequirements.${requirement}.title`))"
            v-model="selectedRequirements"
            :value="newMca ? requirement : null"
            @change="getCurrentCheckbox"
          >
            <i
              v-if="!newMca"
              class="material-icons text-success mr-2 ps_gs-fz-18"
            >
              check
            </i>
            <div>
              <span
                class="ps_gs-fz-14 font-weight-normal mb-1"
                v-html="$t(`mcaRequirements.${requirement}.title`)"
              />
              <p class="ps_gs-fz-12 text-muted">
                {{ $t(`mcaRequirements.${requirement}.description`) }}<br>
                <a
                  v-html="$t(`mcaRequirements.${requirement}.link`)"
                  :href="$options.googleUrl[requirement]"
                  target="_blank"
                />
              </p>
            </div>
          </component>
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
            v-b-tooltip:psxMktgWithGoogleApp
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
            v-b-tooltip:psxMktgWithGoogleApp
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

      <b-form-group>
        <div class="d-flex align-items-center mb-1">
          <label
            for="inputBusinessAddress"
            class="h4 mb-0 font-weight-600"
          >
            {{ $t('mcaRequirements.businessAddress') }}
          </label>
          <b-button
            v-b-tooltip
            :title="$t(`tooltip.GMCForm.businessAddress`)"
            variant="invisible"
            class="ml-1 p-0 d-flex text-primary"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12">
              error_outline
            </span>
          </b-button>
        </div>
        <b-form-input
          id="inputBusinessAddress"
          aria-describedby="businessAddressFeedback"
          :value="shopInformations.store.streetAddress"
          readonly
          class="maxw-sm-420"
        />

        <VueShowdown
          id="businessAddressFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changeAddressField', [storeInformationsUrl])"
        />
      </b-form-group>

      <b-form-group>
        <div class="d-flex align-items-center mb-1">
          <label
            for="inputBusinessZipCode"
            class="h4 mb-0 font-weight-600"
          >
            {{ $t('mcaRequirements.businessZipCode') }}
          </label>
          <b-button
            v-b-tooltip
            :title="$t(`tooltip.GMCForm.businessZipCode`)"
            variant="invisible"
            class="ml-1 p-0 d-flex text-primary"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12">
              error_outline
            </span>
          </b-button>
        </div>
        <b-form-input
          id="inputBusinessZipCode"
          aria-describedby="businessZipCodeFeedback"
          :value="shopInformations.store.postalCode"
          readonly
          class="maxw-sm-420"
        />

        <VueShowdown
          id="businessZipCodeFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changeZipCodeField', [storeInformationsUrl])"
        />
      </b-form-group>

      <b-form-group>
        <div class="d-flex align-items-center mb-1">
          <label
            for="inputBusinessCity"
            class="h4 mb-0 font-weight-600"
          >
            {{ $t('mcaRequirements.businessCity') }}
          </label>
          <b-button
            v-b-tooltip
            :title="$t(`tooltip.GMCForm.businessCity`)"
            variant="invisible"
            class="ml-1 p-0 d-flex text-primary"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12">
              error_outline
            </span>
          </b-button>
        </div>
        <b-form-input
          id="inputBusinessCity"
          aria-describedby="businessCityFeedback"
          :value="shopInformations.store.locality"
          readonly
          class="maxw-sm-420"
        />
        <VueShowdown
          id="businessCityFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changeCityField', [storeInformationsUrl])"
        />
      </b-form-group>

      <b-form-group>
        <div class="d-flex align-items-center mb-1">
          <label
            for="inputBusinessCountry"
            class="h4 mb-0 font-weight-600"
          >
            {{ $t('mcaRequirements.businessCountry') }}
          </label>
          <b-button
            v-b-tooltip
            :title="$t(`tooltip.GMCForm.businessCountry`)"
            variant="invisible"
            class="ml-1 p-0 d-flex text-primary"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12">
              error_outline
            </span>
          </b-button>
        </div>
        <b-form-input
          id="inputBusinessCountry"
          aria-describedby="businessCountryFeedback"
          :value="shopInformations.store.country.name"
          readonly
          class="maxw-sm-420"
        />
        <VueShowdown
          id="businessCountryFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changeCountryField', [storeInformationsUrl])"
        />
      </b-form-group>

      <b-form-group v-if="Object.prototype.hasOwnProperty.call(shopInformations.store, 'region')">
        <div class="d-flex align-items-center mb-1">
          <label
            for="inputBusinessRegion"
            class="h4 mb-0 font-weight-600"
          >
            {{ $t('mcaRequirements.businessRegion') }}
          </label>
          <b-button
            v-b-tooltip
            :title="$t(`tooltip.GMCForm.businessRegion`)"
            variant="invisible"
            class="ml-1 p-0 d-flex text-primary"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12">
              error_outline
            </span>
          </b-button>
        </div>
        <b-form-input
          id="inputBusinessRegion"
          aria-describedby="businessRegionFeedback"
          :value="shopInformations.store.region ? shopInformations.store.region : ''"
          readonly
          class="maxw-sm-420"
        />
        <VueShowdown
          id="businessRegionFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changeRegionField', [storeInformationsUrl])"
        />
      </b-form-group>

      <b-form-group>
        <div class="d-flex align-items-center mb-1">
          <label
            for="inputBusinessPhone"
            class="h4 mb-0 font-weight-600"
          >
            {{ $t('mcaRequirements.businessPhone') }}
          </label>
          <b-button
            v-b-tooltip
            :title="$t(`tooltip.GMCForm.businessPhone`)"
            variant="invisible"
            class="ml-1 p-0 d-flex text-primary"
          >
            <span class="material-icons-round mb-0 ps_gs-fz-12">
              error_outline
            </span>
          </b-button>
        </div>
        <b-form-input
          id="inputBusinessPhone"
          aria-describedby="businessPhoneNumberFeedback"
          :value="shopInformations.store.phone ? shopInformations.store.phone : ''"
          readonly
          class="maxw-sm-420"
        />
        <VueShowdown
          id="businessPhoneNumberFeedback"
          class="font-weight-normal ps_gs-fz-12 text-muted mb-0"
          :extensions="['extended-link']"
          :markdown="$t('mcaRequirements.changePhoneNumberField', [storeInformationsUrl])"
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
      <div
        v-if="!allFieldsAreFilled() || !verifyPhone() === false"
        class="mr-sm-auto ps_gs-fz-12 text-danger text-left"
      >
        <p
          class="mb-0"
          v-if="!allFieldsAreFilled()"
        >
          <template>
            {{ showFieldsMissing().length === 1
              ? $t('general.XIsMandatory', [showFieldsMissing()])
              : $t('general.XAreMandatory', [showFieldsMissing().join(', ')])
            }}
          </template>
        </p>
        <p
          class="mb-0 mt-0"
          v-if="!verifyPhone()"
        >
          {{ $t('mcaRequirements.phoneFormat') }}
        </p>
      </div>
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
      steps: [
        {
          title: this.$i18n.t('mcaRequirements.steps.websiteRequirements'),
        },
        {
          title: this.$i18n.t('mcaRequirements.steps.shopInfo'),
        },
      ],
      selectedRequirements: [],
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
      return !(
        this.acceptsGoogleTerms
        && (this.containsAdultContent != null)
        && this.allFieldsAreFilled()
      );
    },
    allFieldsAreFilled() {
      return !this.showFieldsMissing().length;
    },
    saveFirstStep() {
      this.stepActiveData = 2;
    },
    stepToChange(value) {
      this.stepActiveData = value;
    },
    getCurrentCheckbox() {
      this.$store.dispatch('accounts/SEND_WEBSITE_REQUIREMENTS', this.selectedRequirements);
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

      if (this.shopInformations.store.region !== undefined) {
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
    showFieldsMissing() {
      const fields = [];

      if (!this.shopInformations.store.phone) {
        fields.push(this.$t('mcaRequirements.businessPhone'));
      }
      if (!this.shopInformations.store.streetAddress) {
        fields.push(this.$t('mcaRequirements.businessAddress'));
      }
      if (!this.shopInformations.store.postalCode) {
        fields.push(this.$t('mcaRequirements.businessZipCode'));
      }
      if (!this.shopInformations.store.locality) {
        fields.push(this.$t('mcaRequirements.businessCity'));
      }

      if (this.shopInformations.store?.region !== undefined
      && !this.shopInformations.store.region) {
        fields.push(this.$t('mcaRequirements.businessRegion'));
      }

      return fields;
    },
    saveChangeExistingGmc() {
      /**
       * TODO: Save change when existing GMC
       */
    },
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
