<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard"
  >
    <b-card-header
      header-tag="nav"
      header-class="px-3 py-1"
    >
      <ol class="list-inline mb-0 d-sm-flex align-items-center ps_gs-breadcrumb">
        <li class="list-inline-item ps_gs-breadcrumb__item">
          <a
            href=""
            class="d-flex align-items-center ps_gs-breadcrumb__link"
          >
            <img
              class="ps_gs-breadcrumb__icon"
              src="@/assets/images/Google-Commercial-icon.svg"
              width="40"
              height="40"
              alt=""
            >
            {{ $t('smartShoppingCampaignCreation.breadcrumb1') }}
          </a>
        </li>
        <li class="list-inline-item ps_gs-breadcrumb__item ml-4 ml-sm-0">
          {{ $t('smartShoppingCampaignCreation.breadcrumb2') }}
        </li>
      </ol>
    </b-card-header>
    <b-card-body
      body-class="p-3 p-md-4"
    >
      <b-form>
        <b-form-group
          id="campaign-name-fieldset"
          :description="$t('smartShoppingCampaignCreation.inputNameHelper')"
          label-for="campaign-name-input"
          label-class="d-flex align-items-center font-weight-600"
        >
          <template #label>
            {{ $t('smartShoppingCampaignCreation.inputNameLabel') }}
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="$t('smartShoppingCampaignCreation.inputNameTooltip')"
            >
              <span class="material-icons-round mb-0 ps_gs-fz-16 text-primary">
                error_outline
              </span>
            </b-button>
          </template>
          <b-form-input
            id="campaign-name-input"
            @keyup="debounceName()"
            v-model="campaignName"
            :placeholder="$t('smartShoppingCampaignCreation.inputNamePlaceholder')"
            class="maxw-sm-420"
            :state="campaignNameFeedback"
            :invalid-feedback="$t('smartShoppingCampaignCreation.inputCampaignNameInvalidFeedback')"
          />
        </b-form-group>
        <b-form-group
          id="campaign-duration-fieldset"
          class="maxw-sm-420"
          :description="$t('smartShoppingCampaignCreation.inputDurationHelper')"
          label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
        >
          <template #label>
            {{ $t('smartShoppingCampaignCreation.inputDurationLabel') }}
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="$t('smartShoppingCampaignCreation.inputDurationTooltip')"
            >
              <span class="material-icons-round mb-0 ps_gs-fz-16 text-primary">
                error_outline
              </span>
            </b-button>
          </template>
          <b-form-row>
            <b-col
              cols="12"
              md="6"
              class="mb-3 mb-md-0"
            >
              <label for="campaign-duration-start-date-input">
                {{ $t('smartShoppingCampaignCreation.inputDurationLabel1') }}
              </label>
              <b-form-datepicker
                id="campaign-duration-start-date-input"
                v-model="campaignDurationStartDate"
                :min="new Date()"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                reset-button
                :label-reset-button="$t('cta.resetDate')"
                :reset-value="new Date()"
                reset-button-variant="outline-secondary sm"
                :hide-header="true"
                :label-help="$t('smartShoppingCampaignCreation.inputDatePickerHelper')"
                :required="true"
                class="ps_gs-datepicker"
              />
            </b-col>
            <b-col
              cols="12"
              md="6"
            >
              <label for="campaign-duration-end-date-input">
                {{ $t('smartShoppingCampaignCreation.inputDurationLabel2') }}
              </label>
              <b-form-datepicker
                id="campaign-duration-end-date-input"
                v-model="campaignDurationEndDate"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                :min="new Date()"
                reset-button
                :label-reset-button="$t('cta.resetDate')"
                reset-button-variant="outline-secondary sm"
                :hide-header="true"
                :label-help="$t('smartShoppingCampaignCreation.inputDatePickerHelper')"
                :required="false"
                class="ps_gs-datepicker"
              />
            </b-col>
          </b-form-row>
        </b-form-group>
        <b-form-group
          id="campaign-target-country-fieldset"
          label-class="d-flex align-items-center font-weight-600"
          label-for="campaign-target-country-input"
          :description="$t('smartShoppingCampaignCreation.inputCountryHelper')"
          class="maxw-sm-420"
        >
          <template #label>
            {{ $t('smartShoppingCampaignCreation.inputCountryLabel') }}
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="$t('smartShoppingCampaignCreation.inputCountryTooltip')"
            >
              <span class="material-icons-round mb-0 ps_gs-fz-16 text-primary">
                error_outline
              </span>
            </b-button>
          </template>
          <SelectCountry
            :currency="currency"
            @countrySelected="saveCountrySelected"
            :default-country="countries"
          />
        </b-form-group>
        <b-form-group
          :label="$t('smartShoppingCampaignCreation.inputFiltersLegend')"
          id="campaign-products-filter-fieldset"
          label-class="h4 font-weight-600 border-0 bg-transparent"
        >
          <b-form-radio
            v-model="campaignProductsFilter"
            name="campaign-product-filter-radios"
            :value="true"
            class="mb-1"
          >
            {{ $t('smartShoppingCampaignCreation.inputFiltersAllLabel') }}
          </b-form-radio>
          <b-form-radio
            v-model="campaignProductsFilter"
            name="campaign-product-filter-radios"
            :value="false"
          >
            {{ $t('smartShoppingCampaignCreation.inputFiltersPartialLabel') }}
          </b-form-radio>
          <template #description>
            <VueShowdown
              tag="p"
              class="mb-0"
              :markdown="$t('smartShoppingCampaignCreation.inputFiltersHelper', ['//google.com'])"
              :extensions="['extended-link', 'no-p-tag']"
            />
          </template>
          <b-button
            v-if="campaignProductsFilter === false"
            variant="primary"
            size="sm"
            class="my-3"
            @click="openFilterPopin"
          >
            {{ $t('cta.selectFilters') }}
          </b-button>
        </b-form-group>
        <b-form-group
          id="campaign-daily-budget-fieldset"
          :description="$t('smartShoppingCampaignCreation.inputBudgetHelper')"
          label-for="campaign-dailyBudget-input"
          label-class="d-flex align-items-center font-weight-600"
          :state="campaignDailyBudgetFeedback"
          aria-describedby="campaign-daily-budget-fieldset__BV_description_ input-live-feedback"
          :invalid-feedback="$t('smartShoppingCampaignCreation.inputBudgetInvalidFeedback')"
        >
          <template #label>
            {{ $t('smartShoppingCampaignCreation.inputBudgetFeedback') }}
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="$t('smartShoppingCampaignCreation.inputBudgetTooltip')"
            >
              <i class="material-icons-round mb-0 ps_gs-fz-16 text-primary">
                error_outline
              </i>
            </b-button>
          </template>
          <b-input-group
            :prepend="budgetCurrencySymbol"
            :append="currency"
            class="maxw-sm-420"
          >
            <b-form-input
              id="campaign-dailyBudget-input"
              v-model="campaignDailyBudget"
              :placeholder="$t('smartShoppingCampaignCreation.inputBudgetPlaceholder')"
              :state="campaignDailyBudgetFeedback"
            />
          </b-input-group>
        </b-form-group>
        <span class="font-weight-600">
          {{ $t('smartShoppingCampaignCreation.formHelperTitle') }}
        </span>
        <p>
          {{ $t('smartShoppingCampaignCreation.formHelperDescription') }}
        </p>
        <b-alert
          variant="warning"
          show
        >
          {{ $t('smartShoppingCampaignCreation.errorNoProducts') }}
        </b-alert>
        <div class="d-md-flex text-center justify-content-end mt-3 pt-2">
          <b-button
            @click="cancel"
            size="sm"
            class="mx-1 mt-3 mt-md-0"
            variant="outline-secondary"
          >
            {{ $t('cta.cancel') }}
          </b-button>
          <b-button
            data-test-id="createCampaignButton"
            @click="openPopinRecap"
            size="sm"
            :disabled="disableCreateCampaign"
            class="mx-1 mt-3 mt-md-0 mr-md-0"
            variant="primary"
          >
            {{ $t('cta.createCampaign') }}
          </b-button>
        </div>
      </b-form>
    </b-card-body>
    <SmartShoppingCampaignCreationFilterPopin ref="SmartShoppingCampaignCreationFilterPopin" />
    <SmartShoppingCampaignCreationPopinRecap
      ref="SmartShoppingCampaignCreationPopinRecap"
      :new-campaign="finalCampaign"
      @openPopinSSCCreated="onCampaignCreated"
    />
  </b-card>
</template>

<script>
import countriesSelectionOptions from '@/assets/json/countries.json';
import SmartShoppingCampaignCreationFilterPopin from './smart-shopping-campaign-creation-filter-popin.vue';
import SmartShoppingCampaignCreationPopinRecap from './smart-shopping-campaign-creation-popin-recap.vue';
import SelectCountry from '../commons/select-country.vue';

export default {
  name: 'SmartShoppingCampaignCreation',
  data() {
    return {
      campaignName: 'null',
      campaignDurationStartDate: new Date(),
      campaignDurationEndDate: null,
      campaignProductsFilter: null,
      filtersChosen: [{
        dimension: null,
        values: [],
      }],
      campaignDailyBudget: null,
      timer: null,
    };
  },
  components: {
    SmartShoppingCampaignCreationFilterPopin,
    SmartShoppingCampaignCreationPopinRecap,
    SelectCountry,
  },
  computed: {
    disableCreateCampaign() {
      if (this.campaignName
      && this.errorCampaignNameExistsAlready === false
      && this.campaignDurationStartDate
      && this.countries
      && (this.campaignProductsFilter === true
      || (this.campaignProductsFilter === false && this.filtersChosen.length))
      && this.campaignDailyBudget) {
        return false;
      }
      return true;
    },
    campaignNameFeedback() {
      if (!this.campaignName === null || this.errorCampaignNameExistsAlready === null) {
        return null;
      }

      if (this.campaignName
        && this.campaignName.length <= 125
       && this.campaignName.length > 0
        && this.errorCampaignNameExistsAlready === false
      ) {
        return true;
      }
      if (this.campaignName
        || this.campaignName.length <= 125
        || this.campaignName.length > 0
        || this.errorCampaignNameExistsAlready === true
      ) {
        return false;
      }
      return null;
    },
    campaignDailyBudgetFeedback() {
      // TODO
      // I'm just looking for digit, validation should be way better than that
      const regex = /^[0-9]+([.|,][0-9]{0,2})?$/g;

      if (this.campaignDailyBudget === null
        || this.campaignDailyBudget === ''
      ) {
        return null;
      }

      if (this.campaignDailyBudget < 1) {
        return false;
      }

      return !!regex.test(this.campaignDailyBudget);
    },
    sortCountries() {
      countriesSelectionOptions.forEach((el) => {
        el.disabled = !!(el.currency === this.currency);
      });
      return countriesSelectionOptions;
    },
    currency() {
      return this.$store.getters['app/GET_CURRENT_CURRENCY'];
    },
    errorCampaignNameExistsAlready() {
      return false;
      // return this.$store.getters['smartShoppingCampaigns/GET_ERROR_CAMPAIGN_NAME'];
    },
    countries: {
      get() {
        return this.$options.filters.changeCountriesCodesToNames(
          this.$store.getters['app/GET_ACTIVE_COUNTRIES'],
        );
      },
    },
    finalCampaign() {
      return {
        campaignName: this.campaignName,
        dailyBudget: this.campaignDailyBudget,
        currencyCode: this.currency,
        startDate: this.campaignDurationStartDate,
        endDate: this.campaignDurationEndDate,
        // Countries is still an array because refacto later for multiple countries
        targetCountry: this.countries[0],
        productFilters: this.filtersChosen,
      };
    },
    budgetCurrencySymbol() {
      const displayAmount = 0;
      const currencyFormatted = displayAmount.toLocaleString(this.countries[0], {
        style: 'currency', currency: this.currency,
      });
      return currencyFormatted[5];
    },
  },
  methods: {
    debounceName() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.dispatch('smartShoppingCampaigns/CHECK_CAMPAIGN_NAME_ALREADY_EXISTS', this.campaignName);
      }, 3000);
    },
    cancel() {
      this.$router.push({
        name: 'campaign',
      });
    },
    openPopinRecap() {
      this.$bvModal.show(
        this.$refs.SmartShoppingCampaignCreationPopinRecap.$refs.modal.id,
      );
    },
    isCompatibleWithCurrency(country) {
      const currentCountry = countriesSelectionOptions.find((el) => el.country === country);
      return currentCountry.currency === this.currency;
    },
    saveCountrySelected(value) {
      this.$store.commit('app/SET_SELECTED_TARGET_COUNTRY', value);
    },
    openFilterPopin() {
      this.$bvModal.show(
        this.$refs.SmartShoppingCampaignCreationFilterPopin.$refs.modal.id,
      );
    },
    onCampaignCreated() {
      this.$emit('campaignCreated');
    },
  },
  watch: {
    campaignName(oldVal, newVal) {
      if ((newVal !== oldVal) && this.errorCampaignNameExistsAlready !== null) {
        this.$store.commit('smartShoppingCampaigns/SET_ERROR_CAMPAIGN_NAME_EXISTS', false);
      }
    },
  },
  countriesSelectionOptions,
};
</script>
