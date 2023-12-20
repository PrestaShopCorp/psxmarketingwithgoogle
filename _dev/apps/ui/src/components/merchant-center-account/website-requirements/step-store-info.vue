<template>
  <form
    class="my-1"
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
          <span class="material-icons-round mb-0 ps_gs-fz-12 text-secondary">
            help_outline
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
          <span class="material-icons-round mb-0 ps_gs-fz-12 text-secondary">
            help_outline
          </span>
        </b-button>
      </div>
      <span
        class="d-block"
        :class="loadingClass"
      >
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
          <span class="material-icons-round mb-0 ps_gs-fz-12 text-secondary">
            help_outline
          </span>
        </b-button>
      </div>
      <span
        class="d-block"
        :class="loadingClass"
      >
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
          <span class="material-icons-round mb-0 ps_gs-fz-12 text-secondary">
            help_outline
          </span>
        </b-button>
      </div>
      <span
        class="d-block"
        :class="loadingClass"
      >
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
          <span class="material-icons-round mb-0 ps_gs-fz-12 text-secondary">
            help_outline
          </span>
        </b-button>
      </div>
      <span
        class="d-block"
        :class="loadingClass"
      >
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
          <span class="material-icons-round mb-0 ps_gs-fz-12 text-secondary">
            help_outline
          </span>
        </b-button>
      </div>
      <span
        class="d-block"
        :class="loadingClass"
      >
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
          <span class="material-icons-round mb-0 ps_gs-fz-12 text-secondary">
            help_outline
          </span>
        </b-button>
      </div>
      <span
        class="d-block"
        :class="loadingClass"
      >
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
          <span class="material-icons-round mb-0 ps_gs-fz-12 text-secondary">
            help_outline
          </span>
        </b-button>
      </div>
      <span
        class="d-block"
        :class="loadingClass"
      >
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
    <div class="d-flex align-items-center justify-content-between mb-4">
      <p class="maxw-sm-500 mb-0">
        {{ $t('mcaRequirements.updateData') }}
      </p>
      <b-button
        size="sm"
        @click="refreshDatas"
        class="d-inline-flex align-items-center mx-auto ml-sm-3 mr-sm-0"
        variant="outline-secondary"
      >
        <span>
          {{ $t('cta.refreshInformations') }}
        </span>
        <span
          v-if="loading"
          class="ml-1 icon-busy icon-busy--dark"
        />
      </b-button>
    </div>
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
          class="d-inline-block ps_gs-fz-12 mb-2 mb-sm-0"
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
          <b-form-radio :value="false">
            {{ $t('cta.no') }}
          </b-form-radio>
          <b-form-radio :value="true">
            {{ $t('cta.yes') }}
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
</template>
<script>
import googleUrl from '@/assets/json/googleUrl.json';

export default {
  data() {
    return {
      containsAdultContent: false,
      acceptsGoogleTerms: false,
      loading: false,
    };
  },
  watch: {
    containsAdultContent() {
      this.stepStoreInfoValidation();
    },
    acceptsGoogleTerms() {
      this.stepStoreInfoValidation();
    },
  },
  mounted() {
    this.$store.dispatch('accounts/REQUEST_SHOP_INFORMATIONS');
  },
  methods: {
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
    verifyPhone() {
      return !!(this.shopInformations.store.phone && this.shopInformations.store.phone.match(/^[+0-9. ()/-]*$/));
    },
    stepStoreInfoValidation() {
      this.$emit('stepStoreInfoValidation',
        !(this.acceptsGoogleTerms
        && (this.containsAdultContent != null)
        && this.allFieldsAreFilled()),
        this.containsAdultContent,
      );
    },
    refreshDatas() {
      this.loading = true;
      this.$store.dispatch('accounts/REQUEST_SHOP_INFORMATIONS')
        .finally(() => {
          this.loading = false;
          this.stepStoreInfoValidation();
        });
    },
  },
  computed: {
    shopInformations() {
      return this.$store.getters['accounts/GET_SHOP_INFORMATIONS'];
    },
    storeInformationsUrl() {
      return `${this.$store.getters['app/GET_STORE_INFORMATION_URL']}#store_fieldset_contact`;
    },
    loadingClass() {
      return {'text-muted': this.loading};
    },
  },
  googleUrl,
};
</script>
