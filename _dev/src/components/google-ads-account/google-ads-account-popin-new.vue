<template>
  <ps-modal
    id="GoogleAdsAccountPopinNew"
    :title="'Create new Google Ads account'"
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
      <h6 class="ps_gs-fz-16 font-weight-600 mb-1">
        {{ $t('googleAdsAccountNew.email.title') }}
      </h6>
      <VueShowdown
        class="mb-3 pb-2"
        :markdown="$t('googleAdsAccountNew.email.description')"
      />
      <div class="d-flex align-items-center p-3 border rounded">
        <img
          :src="user.details.picture"
          :alt="user.details.email"
          class="mr-3 rounded-circle"
        >
        <strong>{{ user.details.email }}</strong>
      </div>
    </div>
    <form
      class="my-1"
      v-else-if="stepActiveData === 2"
    >
      <section class="mb-3">
        <h6 class="ps_gs-fz-16 mb-0 font-weight-600">
          {{ $t('googleAdsAccountNew.business.title') }}
        </h6>
        <VueShowdown
          class="mb-3 pb-2"
          :markdown="$t('googleAdsAccountNew.business.description')"
        />
        <label
          class="font-weight-600 mb-0"
          for="selectBillingCountry"
        >
          {{ $t('googleAdsAccountNew.business.labelCountry') }}
        </label>
        <ps-select
          v-model="selectedBillingCountry"
          :placeholder="$t('googleAdsAccountNew.business.placeholderCountry')"
          :reduce="country => country.code"
          :options="this.$options.countriesSelectionOptions"
          :deselect-from-dropdown="true"
          :clearable="false"
          class="ps_gs-v-select"
          label="country"
          id="selectBillingCountry"
        >
          <template #option="{ country }">
            <div class="d-flex flex-wrap flex-md-nowrap align-items-center pr-3">
              <span class="mr-2">
                {{ country }}
              </span>
            </div>
          </template>
        </ps-select>
        <label
          class="font-weight-600 mb-0 mt-3 pt-2"
          for="selectBillingCountry"
        >
          {{ $t('googleAdsAccountNew.business.labelTimeZone') }}
        </label>
        <b-dropdown
          id="selectTimezone"
          ref="selectTimezone"
          :text="selectedTimeZone || $t('googleAdsAccountNew.business.placeholderTimeZone')"
          variant=" "
          class="flex-grow-1 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
          :toggle-class="{'ps-dropdown__placeholder' : selectedTimeZone === null}"
          menu-class="ps-dropdown"
          no-flip
          size="sm"
        >
          <b-dropdown-item
            v-for="(option, index) in $options.timezones"
            :key="index"
            :value="option.offset"
            @click="selectedTimeZone = option.text"
            variant="dark"
            link-class="d-flex flex-wrap flex-md-nowrap align-items-center px-3"
          >
            <span class="mr-2">
              {{ option.text }}
            </span>
          </b-dropdown-item>
        </b-dropdown>
        <label
          class="font-weight-600 mb-0 mt-3 pt-2"
          for="selectBillingCountry"
        >
          {{ $t('googleAdsAccountNew.business.labelCurrency') }}
        </label>
        <b-dropdown
          id="selectTimezone"
          ref="selectTimezone"
          :text="selectedCurrency || $t('googleAdsAccountNew.business.placeholderCurrency')"
          variant=" "
          class="flex-grow-1 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
          :toggle-class="{'ps-dropdown__placeholder' : selectedCurrency === null}"
          menu-class="ps-dropdown"
          no-flip
          size="sm"
        >
          <b-dropdown-item
            v-for="(option, index) in $options.timezones"
            :key="index"
            :value="option.offset"
            @click="selectedCurrency = option.text"
            variant="dark"
            link-class="d-flex flex-wrap flex-md-nowrap align-items-center px-3"
          >
            <span class="mr-2">
              {{ option.text }}
            </span>
          </b-dropdown-item>
        </b-dropdown>
      </section>
    </form>
    <div
      class="my-1"
      v-if="stepActiveData === 3"
    >
      <h6 class="ps_gs-fz-16 font-weight-600 mb-1">
        {{ $t('googleAdsAccountNew.terms.title') }}
      </h6>
      <VueShowdown
        class="mb-3 pb-2"
        :markdown="$t('googleAdsAccountNew.terms.description', [
          $options.googleUrl.googleAdsTermsAndCondition
        ])"
        :extensions="['targetlink']"
      />
      <div
        class="d-flex"
      >
        <b-form-checkbox
          class="ps_gs-checkbox"
          v-model="acceptsGoogleTerms"
        >
          <VueShowdown
            :markdown="$t('googleAdsAccountNew.terms.label')"
          />
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
        {{ $t('cta.learnAboutTimeZoneAndCurrency') }}
      </a>
      <b-button
        variant="outline-secondary"
        @click="cancel()"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <b-button
        variant="primary"
        @click="saveSecondStep()"
        class="mr-md-0"
      >
        {{ $t('cta.continue') }}
      </b-button>
    </template>
    <template
      slot="modal-footer"
      v-else-if="stepActiveData === 3"
    >
      <b-button
        variant="outline-secondary"
        @click="cancel()"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <span
        v-b-tooltip:psxMktgWithGoogleApp
        :title="isStepThreeReadyToValidate() ? $t('tooltip.mustAgreeGoogleAdsTerms') : ''"
      >
        <b-button
          variant="primary"
          @click="ok()"
          :disabled="isStepThreeReadyToValidate()"
        >
          {{ $t('cta.createAccount') }}
        </b-button>
      </span>
    </template>
  </ps-modal>
</template>

<script>
import timezones from 'timezones.json';
import googleUrl from '@/assets/json/googleUrl.json';
import countriesSelectionOptions from '../../assets/json/countries.json';
import PsModal from '../commons/ps-modal';
import Stepper from '../commons/stepper';
import PsSelect from '../commons/ps-select.vue';

export default {
  name: 'MerchantCenterAccountPopinWebsiteRequirements',
  components: {
    PsModal,
    Stepper,
    PsSelect,
  },
  data() {
    return {
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
      user: {
        details: {
          email: 'v.godard@maisonroyer.com',
          picture: '//source.unsplash.com/bul_3zwYI6E/38x38',
        },
      },
      selectedBillingCountry: null,
      selectedTimeZone: null,
      selectedCurrency: null,
      acceptsGoogleTerms: false,
    };
  },
  methods: {
    saveSecondStep() {
      this.stepActiveData = 3;
    },
    stepToChange(value) {
      this.stepActiveData = value;
    },
    ok() {
    },
    cancel() {
    },
    isStepThreeReadyToValidate() {
      return !this.acceptsGoogleTerms;
    },
  },
  props: {
    stepActive: {
      type: Number,
      default: 1,
    },
  },
  computed: {
  },
  mounted() {
    this.stepActiveData = this.stepActive;
  },
  googleUrl,
  countriesSelectionOptions,
  timezones,
};
</script>
