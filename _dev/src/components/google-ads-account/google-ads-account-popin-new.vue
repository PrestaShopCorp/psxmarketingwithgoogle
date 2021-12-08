<template>
  <ps-modal
    id="GoogleAdsAccountPopinNew"
    :title="$t('googleAdsAccountNew.title')"
    v-bind="$attrs"
    @close="cancel"
    ref="modal"
  >
    <Stepper
      :active-step="stepActiveData"
      :steps="steps"
      @changeStep="stepToChange($event)"
    />
    <div
      class="my-1"
      v-if="stepActiveData === 1"
    >
      <h6 class="mb-1 ps_gs-fz-16 font-weight-600">
        {{ $t("googleAdsAccountNew.email.title") }}
      </h6>
      <VueShowdown
        class="pb-2 mb-3"
        :markdown="$t('googleAdsAccountNew.email.description')"
      />
      <div class="p-3 border rounded d-flex align-items-center">
        <img
          :src="user.details.picture"
          :alt="user.details.email"
          class="mr-3 rounded-circle"
          width="38"
          height="38"
        >
        <strong class="text-break">{{ user.details.email }}</strong>
      </div>
    </div>
    <form
      class="my-1"
      v-else-if="stepActiveData === 2"
    >
      <section class="mb-3">
        <h6 class="mb-0 ps_gs-fz-16 font-weight-600">
          {{ $t("googleAdsAccountNew.business.title") }}
        </h6>
        <VueShowdown
          class="pb-2 mb-3"
          :markdown="$t('googleAdsAccountNew.business.description')"
        />
        <label
          class="mb-0 font-weight-600"
          for="name"
        >
          {{ $t("googleAdsAccountNew.business.name") }}
        </label>
        <b-form-input
          id="businessName"
          aria-describedby="businessName"
          :value="selectedDescriptiveName"
          v-model="selectedDescriptiveName"
          class="mb-4"
          size="sm"
        />
        <label
          class="mb-0 font-weight-600"
          for="selectBillingCountry"
        >
          {{ $t("googleAdsAccountNew.business.labelCountry") }}
        </label>
        <SelectCountry
          :currency="currency"
          @countrySelected="saveCountrySelected"
          :default-country="countries"
        />
        <label
          class="pt-2 mt-3 mb-0 font-weight-600"
          for="selectTimezone"
        >
          {{ $t('googleAdsAccountNew.business.labelTimeZone') }}
        </label>
        <b-dropdown
          id="selectTimezone"
          ref="selectTimezone"
          :text="
            selectedTimeZone ||
              $t('googleAdsAccountNew.business.placeholderTimeZone')
          "
          variant=" "
          class="flex-grow-1 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
          :toggle-class="{
            'ps-dropdown__placeholder': !selectedTimeZone,
          }"
          menu-class="ps-dropdown"
          size="sm"
        >
          <b-dropdown-item
            v-for="(option, index) in $options.timezones"
            :key="index"
            :value="option"
            @click="selectedTimeZone = index"
            variant="dark"
            link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
          >
            <span class="mr-2">
              {{ option + ' - ' + index }}
            </span>
          </b-dropdown-item>
        </b-dropdown>
        <label
          class="pt-2 mt-3 mb-0 font-weight-600"
          for="selectCurrency"
        >
          {{ $t("googleAdsAccountNew.business.labelCurrency") }}
        </label>
        <b-dropdown
          id="selectCurrency"
          ref="selectCurrency"
          :text="
            selectedCurrency ||
              $t('googleAdsAccountNew.business.placeholderCurrency')
          "
          variant=" "
          class="flex-grow-1 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
          :toggle-class="{
            'ps-dropdown__placeholder': !selectedCurrency,
          }"
          menu-class="ps-dropdown"
          size="sm"
        >
          <b-dropdown-item
            v-for="(option, index) in currencies"
            :key="index"
            :value="option"
            @click="selectedCurrency = option"
            variant="dark"
            link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
          >
            <span class="mr-2">
              {{ option }}
            </span>
          </b-dropdown-item>
        </b-dropdown>
      </section>
    </form>
    <div
      class="my-1"
      v-if="stepActiveData === 3"
    >
      <h6 class="mb-1 ps_gs-fz-16 font-weight-600">
        {{ $t("googleAdsAccountNew.terms.title") }}
      </h6>
      <VueShowdown
        class="pb-2 mb-3"
        :markdown="
          $t('googleAdsAccountNew.terms.description', [
            $options.googleUrl.googleAdsTermsAndCondition,
          ])
        "
        :extensions="['extended-link']"
      />
      <div class="d-flex">
        <b-form-checkbox
          data-test-id="buttonCheckbox"
          class="ps_gs-checkbox"
          v-model="acceptsGoogleTerms"
        >
          <VueShowdown :markdown="$t('googleAdsAccountNew.terms.label')" />
        </b-form-checkbox>
      </div>
    </div>
    <template
      slot="modal-footer"
      v-if="stepActiveData === 1 || stepActiveData === 2"
    >
      <a
        v-if="stepActiveData === 2"
        class="ps_gs-fz-12 text-muted mr-sm-auto align-self-start"
        :href="$options.googleUrl.learnAboutTimeZoneAndCurrency"
        target="_blank"
      >
        {{ $t("cta.learnAboutTimeZoneAndCurrency") }}
      </a>
      <b-button
        variant="outline-secondary"
        @click="cancel"
      >
        {{ $t("cta.cancel") }}
      </b-button>
      <b-button
        variant="primary"
        @click="stepToChange(stepActiveData + 1)"
        class="mr-md-0"
        data-test-id="buttonContinue"
        :disabled="stepActiveData === 2 && fieldsEmpty()"
      >
        {{ $t("cta.continue") }}
      </b-button>
    </template>
    <template
      slot="modal-footer"
      v-else-if="stepActiveData === 3"
    >
      <b-button
        variant="outline-secondary"
        @click="cancel"
      >
        {{ $t("cta.cancel") }}
      </b-button>
      <span
        v-b-tooltip:psxMktgWithGoogleApp
        :title="
          isStepThreeReadyToValidate()
            ? $t('tooltip.mustAgreeGoogleAdsTerms')
            : ''
        "
        :tabindex="isStepThreeReadyToValidate() ? 0 : null"
      >
        <b-button
          variant="primary"
          @click="ok()"
          data-test-id="buttonContinueStep2"
          :disabled="isStepThreeReadyToValidate()"
        >

          <template v-if="!isCreating">
            {{ $t("cta.createAccount") }}
          </template>
          <template v-else>
            {{ $t('cta.creating') }}
            <span class="ml-1 icon-busy" />
          </template>
        </b-button>
      </span>
    </template>
  </ps-modal>
</template>

<script>
import timezones from 'google-timezones-json';
import googleUrl from '@/assets/json/googleUrl.json';
import countriesSelectionOptions from '../../assets/json/countries.json';
import PsModal from '../commons/ps-modal';
import Stepper from '../commons/stepper';
import SelectCountry from '../commons/select-country.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import GoogleAccountContext from '../../store/modules/accounts/state';

export default {
  name: 'GoogleAdsAccountPopinNew',
  components: {
    PsModal,
    Stepper,
    SelectCountry,
  },

  data() {
    return {
      isCreating: false,
      newAccountInfos: {
        name: '',
        currency: this.$store.getters['app/GET_CURRENT_CURRENCY'],
        timeZone: '',
        country: '',
      },
      stepActiveData: 1,
      steps: [
        {
          title: this.$i18n.t('googleAdsAccountNew.steps.email'),
        },
        {
          title: this.$i18n.t('googleAdsAccountNew.steps.businessInfo'),
        },
        {
          title: this.$i18n.t('googleAdsAccountNew.steps.termsOfService'),
        },
      ],
      acceptsGoogleTerms: false,
    };
  },
  methods: {
    stepToChange(value) {
      this.stepActiveData = value;
      if (value === 2) {
        this.$segment.track('[GGL] Create GAds - Step 1 Email Step', {
          module: 'psxmarketingwithgoogle',
          params: SegmentGenericParams,
        });
      }
      if (value === 3) {
        this.$segment.track('[GGL] Create GAds - Step 2 Business Info Step', {
          module: 'psxmarketingwithgoogle',
          billing_country: this.countries,
          timezone: this.selectedTimeZone,
          currency: this.selectedCurrency,
          params: SegmentGenericParams,
        });
      }
    },
    ok() {
      this.$segment.track('[GGL] Create GAds - Step 3 Terms And Condition Step', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,

      });
      this.isCreating = true;
      this.$store.dispatch('googleAds/SAVE_NEW_GOOGLE_ADS_ACCOUNT', this.newAccountInfos)
        .finally(() => {
          this.isCreating = false;
          this.$refs.modal.hide();
        });
    },
    cancel() {
      this.$refs.modal.hide();
    },
    isStepThreeReadyToValidate() {
      return !this.acceptsGoogleTerms;
    },
    fieldsEmpty() {
      if (this.selectedDescriptiveName
        && this.selectedTimeZone
        && this.selectedCurrency
        && this.newAccountInfos.country
      ) {
        return false;
      }
      return true;
    },
    saveCountrySelected(value) {
      this.newAccountInfos.country = value;
      this.$store.commit('app/SET_SELECTED_TARGET_COUNTRY', value);
    },
  },
  props: {
    user: {
      type: GoogleAccountContext,
      default: null,
    },
    stepActive: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    accountInformations() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'];
    },
    selectedTimeZone: {
      get() {
        return this.newAccountInfos.timeZone;
      },
      set(value) {
        this.newAccountInfos.timeZone = value;
      },
    },
    selectedCurrency: {
      get() {
        return this.newAccountInfos.currency;
      },
      set(value) {
        this.newAccountInfos.currency = value;
      },
    },
    selectedDescriptiveName: {
      get() {
        return this.newAccountInfos.name;
      },
      set(value) {
        this.newAccountInfos.name = value;
      },
    },
    countries: {
      get() {
        return this.newAccountInfos.country;
      },
    },
    currency() {
      return this.$store.getters['app/GET_CURRENT_CURRENCY'];
    },
    currencies() {
      return this.$options.countriesSelectionOptions
        .map((e) => e.currency)
        .reduce((unique, item) => (unique.includes(item) ? unique : [...unique, item]), [])
        .sort();
    },
  },
  mounted() {
    this.$store.dispatch('googleAds/GET_GOOGLE_ADS_SHOPINFORMATIONS_BILLING').then(() => {
      this.newAccountInfos.timeZone = this.$store.getters['googleAds/GET_BILLING_SHOP_INFORMATIONS'].timeZone;
    });
    this.stepActiveData = this.stepActive;
    this.newAccountInfos.country = this.$store.getters['app/GET_ACTIVE_COUNTRIES']
      ? this.$options.filters.changeCountriesCodesToNames(this.$store.getters['app/GET_ACTIVE_COUNTRIES']) : '';
  },
  googleUrl,
  countriesSelectionOptions,
  timezones,
};
</script>
