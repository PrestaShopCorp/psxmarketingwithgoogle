<template>
  <ps-modal
    id="GoogleAdsAccountPopinNew"
    :title="$t('googleAdsAccountNew.title')"
    v-bind="$attrs"
    @close="cancel"
    ref="modal"
  >
    <BannerAds :is-banner="false" />

    <section>
      <h6 class="mb-1 ps_gs-fz-16 font-weight-600">
        {{ $t("googleAdsAccountNew.email.title") }}
      </h6>
      <VueShowdown
        class="pb-2 mb-2"
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
    </section>

    <form
      class="mt-4"
    >
      <div>
        <h6 class="mb-1 ps_gs-fz-16 font-weight-600">
          {{ $t("googleAdsAccountNew.business.title") }}
        </h6>
        <VueShowdown
          class="pb-2 mb-2"
          :markdown="$t('googleAdsAccountNew.business.description')"
        />
        <div>
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
            class="mb-2"
            size="sm"
          />
        </div>
        <div class="d-flex flex-column flex-md-row">
          <div class="flex-grow-1 mr-2">
            <label
              class="mb-0 font-weight-600"
              for="selectBillingCountry"
            >
              {{ $t("googleAdsAccountNew.business.labelCountry") }}
            </label>
            <SelectCountry
              @countrySelected="saveCountrySelected"
              :default-value="defaultCountry()"
              :need-filter="true"
              :dropdown-options="activeCountriesWithCurrency"
            />
          </div>

          <div class="flex-grow-1 mr-2">
            <label
              class="mb-0 font-weight-600"
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
          </div>

          <div class="flex-grow-1">
            <label
              class="mb-0 font-weight-600"
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
          </div>
        </div>
      </div>
    </form>

    <div>
      <h6 class="mb-1 ps_gs-fz-16 font-weight-600 mt-4">
        {{ $t("googleAdsAccountNew.terms.title") }}
      </h6>

      <b-form-checkbox
        data-test-id="buttonCheckbox"
        class="ps_gs-checkbox mt-2"
        v-model="acceptsGoogleTerms"
      >
        <VueShowdown
          :markdown="
            $t('googleAdsAccountNew.terms.label', [
              $options.googleUrl.googleAdsTermsAndCondition,
            ])
          "
          :extensions="['extended-link']"
        />
      </b-form-checkbox>
    </div>
    <template
      slot="modal-footer"
    >
      <div class="mt-2 ">
        <b-button
          variant="outline-secondary"
          @click="cancel"
          class="mr-2"
        >
          {{ $t("cta.cancel") }}
        </b-button>

        <b-button
          variant="primary"
          @click="ok()"
          data-test-id="buttonCreate"
          :disabled="fieldsEmpty()"
        >
          <template v-if="!isCreating">
            {{ $t("cta.createAccount") }}
          </template>
          <template v-else>
            {{ $t('cta.creating') }}
            <span class="ml-1 icon-busy" />
          </template>
        </b-button>
      </div>
    </template>
  </ps-modal>
</template>

<script lang="ts">
import timezones from 'google-timezones-json';
import {PropType, defineComponent} from 'vue';
import googleUrl from '@/assets/json/googleUrl.json';
import countriesSelectionOptions from '../../assets/json/countries.json';
import PsModal from '@/components/commons/ps-modal.vue';
import SelectCountry from '../commons/select-country.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {GoogleAccountContext} from '@/store/modules/accounts/state';
import BannerAds from '../commons/banner-ads.vue';

export default defineComponent({
  name: 'GoogleAdsAccountPopinNew',
  components: {
    PsModal,
    SelectCountry,
    BannerAds,
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
      acceptsGoogleTerms: false,
    };
  },
  methods: {
    ok() {
      this.isCreating = true;
      this.$segment.track('[GGL] Create GAds - New Google ads account created', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,

      });
      this.$store.dispatch('googleAds/SAVE_NEW_GOOGLE_ADS_ACCOUNT', this.newAccountInfos)
        .finally(() => {
          this.isCreating = false;
          this.$refs.modal.hide();
        });
    },
    cancel() {
      this.$refs.modal.hide();
    },
    fieldsEmpty() {
      if (this.selectedDescriptiveName
        && this.selectedTimeZone
        && this.selectedCurrency
        && this.newAccountInfos.country
        && this.acceptsGoogleTerms === true
      ) {
        return false;
      }
      return true;
    },
    saveCountrySelected(value) {
      this.newAccountInfos.country = value;
    },
    defaultCountry() {
      if (!this.$store.state.app.psxMtgWithGoogleDefaultShopCountry) {
        return '';
      }
      return this.$options.filters.changeCountriesCodesToNames(
        [this.$store.state.app.psxMtgWithGoogleDefaultShopCountry],
      )[0];
    },
  },
  props: {
    user: {
      type: Object as PropType<GoogleAccountContext>,
      default: null,
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
    currency() {
      return this.$store.getters['app/GET_CURRENT_CURRENCY'];
    },
    currencies() {
      return this.$options.countriesSelectionOptions
        .map((e) => e.currency)
        .reduce((unique, item) => (unique.includes(item) ? unique : [...unique, item]), [])
        .sort();
    },
    activeCountriesWithCurrency() {
      return this.$store.getters['app/GET_ACTIVE_COUNTRIES_FOR_ACTIVE_CURRENCY'];
    },
  },
  mounted() {
    this.$store.dispatch('googleAds/GET_GOOGLE_ADS_SHOPINFORMATIONS_BILLING').then(() => {
      this.newAccountInfos.timeZone = this.$store.getters['googleAds/GET_BILLING_SHOP_INFORMATIONS'].timeZone;
    });
    this.stepActiveData = this.stepActive;
    this.newAccountInfos.country = this.defaultCountry();
  },
  googleUrl,
  countriesSelectionOptions,
  timezones,
});
</script>
