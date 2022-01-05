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
          <router-link
            class="d-flex align-items-center ps_gs-breadcrumb__link"
            :to="{name: 'campaign'}"
          >
            <img
              class="ps_gs-breadcrumb__icon"
              src="@/assets/images/Google-Commercial-icon.svg"
              width="40"
              height="40"
              alt=""
            >
            {{ $t('smartShoppingCampaignCreation.breadcrumb1') }}
          </router-link>
        </li>
        <li class="list-inline-item ps_gs-breadcrumb__item ml-4 ml-sm-0">
          {{ $t('smartShoppingCampaignCreation.breadcrumb2') }}
        </li>
      </ol>
    </b-card-header>
    <b-card-body
      body-class="p-3 p-md-4"
    >
      <b-alert
        v-if="hasUnhandledFilters"
        show
        variant="info"
        data-test-id="unhandled-filters-alert"
      >
        {{ $t('smartShoppingCampaignCreation.alerts.hasUnhandledFilters') }}
      </b-alert>
      <b-form>
        <b-form-group
          id="campaign-name-fieldset"
          :description="$t('smartShoppingCampaignCreation.inputNameHelper')"
          label-for="campaign-name-input"
          label-class="d-flex align-items-center font-weight-600"
          :state="campaignNameFeedback"
          :invalid-feedback="$t('smartShoppingCampaignCreation.inputCampaignNameInvalidFeedback')"
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
                info_outlined
              </span>
            </b-button>
          </template>
          <b-form-input
            id="campaign-name-input"
            @keyup="debounceName()"
            v-model="campaignName"
            :state="campaignNameFeedback"
            :placeholder="$t('smartShoppingCampaignCreation.inputNamePlaceholder')"
            class="maxw-sm-420"
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
                info_outlined
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
                ref="campaign-duration-start-date-input"
                :start-weekday="1"
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
                @input="openEndDatepicker"
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
                ref="campaignDurationEndDateInput"
                :start-weekday="1"
                v-model="campaignDurationEndDate"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                :min="campaignDurationStartDate"
                reset-button
                :label-reset-button="$t('cta.resetDate')"
                reset-button-variant="outline-secondary sm"
                close-button
                :label-close-button="$t('cta.noEndDate')"
                close-button-variant="outline-secondary sm"
                :hide-header="true"
                :label-help="$t('smartShoppingCampaignCreation.inputDatePickerHelper')"
                :required="false"
                class="ps_gs-datepicker"
                menu-class="ps_gs-datepicker-end"
              />
            </b-col>
          </b-form-row>
        </b-form-group>
        <b-form-group
          id="campaign-target-country-fieldset"
          label-class="d-flex align-items-center font-weight-600"
          label-for="campaign-target-country-input"
          :description="!editMode ?
            $t('smartShoppingCampaignCreation.inputCountryHelper')
            : $t('smartShoppingCampaignCreation.inputCountryImutable')"
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
                info_outlined
              </span>
            </b-button>
          </template>
          <SelectCountry
            v-if="!editMode"
            @countrySelected="saveCountrySelected"
            :default-value="defaultCountry()"
            :need-filter="false"
            :is-multiple="false"
            :dropdown-options="activeCountries"
          />
          <span
            v-else
          >
            {{ targetCountry[0] }}
          </span>
        </b-form-group>
        <b-form-group
          :label="$t('smartShoppingCampaignCreation.inputFiltersLegend')"
          id="campaign-products-filter-fieldset"
          label-class="h4 font-weight-600 border-0 bg-transparent"
        >
          <b-form-radio
            :disabled="hasUnhandledFilters"
            v-model="campaignHasNoProductsFilter"
            name="campaign-product-filter-radios"
            :value="true"
            class="mb-1"
          >
            {{ $t('smartShoppingCampaignCreation.inputFiltersAllLabel') }}
          </b-form-radio>
          <b-form-radio
            :disabled="!productsHaveBeenApprovedByGoogle || hasUnhandledFilters"
            v-model="campaignHasNoProductsFilter"
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
            v-if="!campaignHasNoProductsFilter"
            :disabled="hasUnhandledFilters"
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
                info_outlined
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
        <b-form-checkbox
          v-if="editMode === true"
          switch
          size="lg"
          class="ps_gs-switch mb-3"
          v-model="campaignIsActive"
        >
          <span class="ps_gs-fz-14">
            {{ $t('cta.enabled') }}
          </span>
        </b-form-checkbox>
        <b-alert
          v-if="!productsHaveBeenApprovedByGoogle"
          variant="warning"
          show
        >
          {{ $t('smartShoppingCampaignCreation.errorNoProducts') }}
        </b-alert>
        <b-alert
          v-if="displayError"
          variant="danger"
          show
        >
          {{ $t('smartShoppingCampaignCreation.errorApi') }}
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
            v-if="editMode"
            @click="openPopinRecap"
            size="sm"
            :disabled="disableCreateCampaign"
            class="mx-1 mt-3 mt-md-0 mr-md-0"
            variant="primary"
          >
            {{ $t('cta.editCampaign') }}
          </b-button>
          <b-button
            v-else
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
    <SmartShoppingCampaignCreationPopin
      ref="SmartShoppingCampaignCreationPopin"
      @selectFilters="setDimensionsFiltered"
      :available-filters="availableFilters"
    />
    <SmartShoppingCampaignCreationPopinRecap
      ref="SmartShoppingCampaignCreationPopinRecap"
      :new-campaign="finalCampaign"
      :filters-exist="!campaignHasNoProductsFilter"
      @openPopinSSCCreated="onCampaignCreated"
      @displayErrorApiWhenSavingSSC="onDisplayErrorApi"
      :edition-mode="editMode"
    />
  </b-card>
</template>

<script>
import countriesSelectionOptions from '@/assets/json/countries.json';
import SmartShoppingCampaignCreationPopin from './smart-shopping-campaign-creation-filter-popin/smart-shopping-campaign-creation-popin.vue';
import SmartShoppingCampaignCreationPopinRecap from './smart-shopping-campaign-creation-filter-popin/smart-shopping-campaign-creation-popin-recap.vue';
import SelectCountry from '../commons/select-country.vue';
import symbols from '../../assets/json/symbols.json';
import CampaignStatus from '@/enums/reporting/CampaignStatus';
import {returnChildrenIds, getFiltersbyIds, addPropertiesToDimension} from '../../utils/SSCFilters';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'SmartShoppingCampaignCreation',
  data() {
    return {
      campaignId: 0,
      campaignName: null,
      campaignDurationStartDate: new Date(),
      campaignDurationEndDate: null,
      campaignHasNoProductsFilter: true,
      filtersChosen: [],
      campaignDailyBudget: null,
      timer: null,
      displayError: false,
      campaignIsActive: true,
      targetCountry: null,
      availableFilters: {
        name: this.$t('smartShoppingCampaignCreation.allFilters'),
        id: 'allFilters',
        checked: false,
        indeterminate: false,
        children: [],
      },
      hasUnhandledFilters: false,
    };
  },
  components: {
    SmartShoppingCampaignCreationPopin,
    SmartShoppingCampaignCreationPopinRecap,
    SelectCountry,
  },
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    disableCreateCampaign() {
      if (this.campaignName
      && this.errorCampaignNameExistsAlready === false
      && this.campaignDurationStartDate
      && (this.targetCountry || this.defaultCountry())
      && this.campaignDailyBudget) {
        return false;
      }
      return true;
    },
    campaignNameFeedback() {
      if (!this.campaignName?.length || this.errorCampaignNameExistsAlready === null) {
        return null;
      }
      if (this.campaignName
        && this.campaignName.length <= 125
        && this.campaignName.length > 0
        && this.errorCampaignNameExistsAlready === false
      ) {
        return true;
      }
      return false;
    },
    campaignDailyBudgetFeedback() {
      const regex = /^[0-9]+([.][0-9]{0,2})?$/g;
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
    errorCampaignNameExistsAlready() {
      return this.$store.getters['smartShoppingCampaigns/GET_ERROR_CAMPAIGN_NAME'];
    },
    currency() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']?.currencyCode || '';
    },
    finalCampaignFilters() {
      // IMPORTANT: Do not send the filters property if the campaign has unhandled filters
      if (!this.hasUnhandledFilters) {
        return undefined;
      }
      // An empty array is returned if we want to delete existing filters
      if (this.campaignHasNoProductsFilter) {
        return [];
      }
      return this.filtersChosen;
    },
    finalCampaign() {
      return {
        id: this.campaignId,
        campaignName: this.campaignName,
        dailyBudget: Number(this.campaignDailyBudget),
        currencyCode: this.currency,
        startDate: this.campaignDurationStartDate,
        endDate: this.campaignDurationEndDate,
        targetCountry: this.targetCountry || this.defaultCountry(),
        productFilters: this.finalCampaignFilters,
      };
    },
    budgetCurrencySymbol() {
      try {
        const displayAmount = 0;
        const country = this.defaultCountry();
        const currencyFormatted = displayAmount.toLocaleString(country, {
          style: 'currency', currency: this.currency,
        });
        return currencyFormatted.replace(/[ .,0]*/, '');
      } catch (error) {
        const currency = symbols.find((c) => c.currency === this.currency);
        return currency ? currency.symbol : '';
      }
    },
    productsHaveBeenApprovedByGoogle() {
      return true;
      // return this.$store.state.productFeed.validationSummary.activeItems > 0;
    },
    sscList() {
      return this.$store.getters['smartShoppingCampaigns/GET_ALL_SSC'];
    },
    foundSsc() {
      return this.sscList.find((el) => el.id === this.$route.params.id);
    },
    activeCountries() {
      return this.$store.getters['app/GET_ACTIVE_COUNTRIES'];
    },
  },
  methods: {
    defaultCountry() {
      if (!this.$store.state.app.psxMtgWithGoogleDefaultShopCountry) {
        return '';
      }
      return this.$options.filters.changeCountriesCodesToNames(
        [this.$store.state.app.psxMtgWithGoogleDefaultShopCountry],
      )[0];
    },
    debounceName() {
      if (!this.campaignName.length) {
        return;
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.dispatch('smartShoppingCampaigns/CHECK_CAMPAIGN_NAME_ALREADY_EXISTS', {
          name: this.campaignName,
          id: this.campaignId,
        });
      }, 1000);
    },
    cancel() {
      this.$router.push({
        name: 'campaign',
      });
    },
    openPopinRecap() {
      this.$segment.track('[GGL] Create SSC Settings Step', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.$bvModal.show(
        this.$refs.SmartShoppingCampaignCreationPopinRecap.$refs.modal.id,
      );
    },
    saveCountrySelected(value) {
      this.targetCountry = value;
    },
    openFilterPopin() {
      this.$bvModal.show(
        this.$refs.SmartShoppingCampaignCreationPopin.$refs.modal.id,
      );
    },
    onCampaignCreated() {
      this.$emit('campaignCreated');
    },
    onDisplayErrorApi() {
      this.displayError = true;
    },
    openEndDatepicker() {
      if (
        this.campaignDurationEndDate
          && this.campaignDurationEndDate < this.campaignDurationStartDate
      ) {
        this.campaignDurationEndDate = null;
      }
      this.$refs.campaignDurationEndDateInput.$children[0].show();
    },

    setDimensionsFiltered(dimensions) {
      this.filtersChosen = returnChildrenIds(dimensions);
      // localStorage.setItem('SSCDimensionsFiltered', JSON.stringify(this.availableFilters));
    },
    getDatasFiltersDimensions() {
      this.$store.dispatch('smartShoppingCampaigns/GET_DIMENSIONS_FILTERS').then((res) => {
        if (localStorage.getItem('SSCDimensionsFiltered')) {
          this.availableFilters = JSON.parse(localStorage.getItem('SSCDimensionsFiltered'));
          return;
        }
        Object.keys(res).forEach((dimensionName) => {
          // Do not display a dimension with no filter inside
          if (!res[dimensionName].length) {
            return;
          }
          this.availableFilters.children.push({
            name: this.$t(`smartShoppingCampaignCreation.${dimensionName}`),
            subtitle: this.$t(`smartShoppingCampaignCreation.${dimensionName}SubTitle`),
            id: dimensionName,
            checked: false,
            indeterminate: false,
            children: addPropertiesToDimension(res[dimensionName]),
          });
        });
        if (this.editMode) {
          const result = getFiltersbyIds(this.foundSsc.productFilters, this.availableFilters);
          this.availableFilters = result;
        }
      });
    },
  },
  watch: {
    campaignName(oldVal, newVal) {
      if ((newVal !== oldVal) && this.errorCampaignNameExistsAlready !== null) {
        this.$store.commit('smartShoppingCampaigns/SET_ERROR_CAMPAIGN_NAME_EXISTS', null);
      }
    },
  },
  mounted() {
    window.scrollTo(0, 0);
    if (this.editMode === true) {
      if (this.foundSsc !== undefined) {
        this.campaignName = this.foundSsc.campaignName;
        this.campaignDurationStartDate = this.foundSsc.startDate;
        this.campaignDurationEndDate = this.foundSsc.endDate || null;
        this.campaignHasNoProductsFilter = !this.foundSsc.productFilters.length
          && !this.foundSsc.hasUnhandledFilters;
        this.filtersChosen = this.foundSsc.productFilters;
        this.campaignDailyBudget = this.foundSsc.dailyBudget;
        this.campaignIsActive = this.foundSsc.status === CampaignStatus.ELIGIBLE;
        this.campaignId = this.foundSsc.id;
        this.targetCountry = this.$options.filters.changeCountriesCodesToNames(
          [this.foundSsc.targetCountry],
        );
        this.hasUnhandledFilters = this.foundSsc.hasUnhandledFilters;
        this.debounceName();
      } else {
        this.$router.push({name: 'campaign-list'});
      }
    }
    this.getDatasFiltersDimensions();
  },
  countriesSelectionOptions,
};
</script>
