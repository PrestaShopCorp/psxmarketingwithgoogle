<template>
  <section>
    <b-skeleton-wrapper
      :loading="loader"
      class="mb-3"
    >
      <template #loading>
        <b-card>
          <b-skeleton width="85%" />
          <b-skeleton width="55%" />
          <b-skeleton width="70%" />
        </b-card>
      </template>
      <b-card
        no-body
        class="ps_gs-onboardingcard"
      >
        <b-card-header
          header-tag="nav"
          header-class="px-3 py-1"
        >
          <ol
            class="list-inline mb-0 d-sm-flex align-items-center ps_gs-breadcrumb"
          >
            <li class="list-inline-item ps_gs-breadcrumb__item">
              <router-link
                class="d-flex align-items-center ps_gs-breadcrumb__link"
                :to="{ name: 'campaign' }"
              >
                <img
                  class="ps_gs-breadcrumb__icon"
                  src="@/assets/images/Google-Commercial-icon.svg"
                  width="40"
                  height="40"
                  alt=""
                >
                {{ $t("smartShoppingCampaignCreation.breadcrumb1") }}
              </router-link>
            </li>
            <li class="list-inline-item ps_gs-breadcrumb__item ml-4 ml-sm-0">
              {{ formTitle }}
            </li>
          </ol>
        </b-card-header>
        <b-card-body body-class="p-3 p-md-4">
          <b-alert
            v-if="$route.params.type === $options.CampaignTypes.PERFORMANCE_MAX"
            show
            variant="info"
            data-test-id="unhandled-filters-alert"
          >
            <i18n
              path="smartShoppingCampaignCreation.alerts.PMaxExplanation"
              tag="div"
            >
              <b-link
                :to="{ name: 'help' }"
                class="with-hover text-decoration-underline"
              >
                {{ $t("general.helpPage") }}
              </b-link>
            </i18n>
          </b-alert>
          <b-alert
            v-if="hasUnhandledFilters"
            show
            variant="info"
            data-test-id="unhandled-filters-alert"
          >
            {{ $t("smartShoppingCampaignCreation.alerts.hasUnhandledFilters") }}
          </b-alert>
          <b-alert
            v-if="errorFetchingFilters"
            variant="info"
            show
          >
            {{ $t("smartShoppingCampaignCreation.errorFetchingFilters") }}
          </b-alert>

          <BannerAds
            version="short"
            v-if="isBanner"
            :is-banner="isBanner"
            @closeBanner="isBanner =!isBanner"
          />

          <b-form>
            <b-form-group
              id="campaign-name-fieldset"
              :description="$t('smartShoppingCampaignCreation.inputNameHelper')"
              label-for="campaign-name-input"
              data-test-id="campaign-name-input"
              label-class="d-flex align-items-center font-weight-600"
              :state="campaignNameFeedback"
              :invalid-feedback="
                $t('smartShoppingCampaignCreation.inputCampaignNameInvalidFeedback')
              "
            >
              <template #label>
                {{ $t("smartShoppingCampaignCreation.inputNameLabel") }}
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
                :placeholder="
                  $t('smartShoppingCampaignCreation.inputNamePlaceholder')
                "
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
                {{ $t("smartShoppingCampaignCreation.inputDurationLabel") }}
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
                    {{ $t("smartShoppingCampaignCreation.inputDurationLabel1") }}
                  </label>
                  <b-form-datepicker
                    id="campaign-duration-start-date-input"
                    ref="campaign-duration-start-date-input"
                    :start-weekday="1"
                    v-model="campaignDurationStartDate"
                    :min="new Date()"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    }"
                    reset-button
                    :label-reset-button="$t('cta.resetDate')"
                    :reset-value="new Date()"
                    reset-button-variant="outline-secondary sm"
                    :hide-header="true"
                    :label-help="
                      $t('smartShoppingCampaignCreation.inputDatePickerHelper')
                    "
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
                    {{ $t("smartShoppingCampaignCreation.inputDurationLabel2") }}
                  </label>
                  <b-form-datepicker
                    id="campaign-duration-end-date-input"
                    ref="campaignDurationEndDateInput"
                    :start-weekday="1"
                    v-model="campaignDurationEndDate"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    }"
                    :min="campaignDurationStartDate"
                    reset-button
                    :label-reset-button="$t('cta.resetDate')"
                    reset-button-variant="outline-secondary sm"
                    close-button
                    :label-close-button="$t('cta.noEndDate')"
                    close-button-variant="outline-secondary sm"
                    :hide-header="true"
                    :label-help="
                      $t('smartShoppingCampaignCreation.inputDatePickerHelper')
                    "
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
              :description="
                !editMode
                  ? $t('smartShoppingCampaignCreation.inputCountryHelper')
                  : $t('smartShoppingCampaignCreation.inputCountryImutable')
              "
              class="maxw-sm-420"
            >
              <template #label>
                {{ $t("smartShoppingCampaignCreation.inputCountryLabel") }}
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
                :dropdown-options="activeCountries"
              />
              <span v-else>
                {{ targetCountry }}
              </span>
            </b-form-group>
            <b-form-group
              :label="$t('smartShoppingCampaignCreation.inputFiltersLegend')"
              id="campaign-products-filter-fieldset"
              label-class="h4 font-weight-600 border-0 bg-transparent"
            >
              <b-form-radio
                :disabled="hasUnhandledFilters || errorFetchingFilters"
                v-model="campaignHasNoProductsFilter"
                name="campaign-product-filter-radios"
                :value="true"
                class="mb-1"
              >
                {{ $t("smartShoppingCampaignCreation.inputFiltersAllLabel") }}
              </b-form-radio>
              <b-form-radio
                :disabled="
                  !productsHaveBeenApprovedByGoogle ||
                    hasUnhandledFilters ||
                    errorFetchingFilters
                "
                v-model="campaignHasNoProductsFilter"
                name="campaign-product-filter-radios"
                :value="false"
              >
                {{ $t("smartShoppingCampaignCreation.inputFiltersPartialLabel") }}
              </b-form-radio>
              <template #description>
                <VueShowdown
                  tag="p"
                  class="mb-0"
                  :markdown="
                    $t('smartShoppingCampaignCreation.inputFiltersHelper', [
                      $options.googleUrl.shoppingAdsPolicies,
                    ])
                  "
                  :extensions="['extended-link', 'no-p-tag']"
                />
              </template>
              <div class="d-flex">
                <b-button
                  data-test-id="campaign-select-filter-button"
                  v-if="!campaignHasNoProductsFilter"
                  :disabled="
                    !productsHaveBeenApprovedByGoogle ||
                      hasUnhandledFilters ||
                      errorFetchingFilters
                  "
                  variant="primary"
                  size="sm"
                  class="my-3"
                  @click="openFilterPopin"
                >
                  {{ $t("cta.selectFilters") }}
                </b-button>
                <div
                  v-if="!campaignHasNoProductsFilter
                    && filtersChosen.length
                    && !hasUnhandledFilters"
                  class="align-self-center ml-2 font-weight-600"
                >
                  {{ $tc(
                    'smartShoppingCampaignCreation.filtersWithxValues',
                    this.totalProducts,
                    [
                      $t(`smartShoppingCampaignCreation.${dimensionName}`),
                      this.totalProducts,
                    ],
                  ),
                  }}
                </div>
              </div>
            </b-form-group>
            <b-form-group
              id="campaign-daily-budget-fieldset"
              :description="$t('smartShoppingCampaignCreation.inputBudgetHelper')"
              label-for="campaign-dailyBudget-input"
              label-class="d-flex align-items-center font-weight-600"
              :state="campaignDailyBudgetFeedback"
              aria-describedby="campaign-daily-budget-fieldset__BV_description_ input-live-feedback"
              :invalid-feedback="
                $t('smartShoppingCampaignCreation.inputBudgetInvalidFeedback')
              "
            >
              <template #label>
                {{ $t("smartShoppingCampaignCreation.inputBudgetFeedback") }}
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
                  data-test-id="campaign-dailyBudget-input"
                  id="campaign-dailyBudget-input"
                  v-model="campaignDailyBudget"
                  :placeholder="
                    $t('smartShoppingCampaignCreation.inputBudgetPlaceholder')
                  "
                  :state="campaignDailyBudgetFeedback"
                />
              </b-input-group>
            </b-form-group>
            <span class="font-weight-600">
              {{ $t("smartShoppingCampaignCreation.formHelperTitle") }}
            </span>
            <p>
              {{ $t("smartShoppingCampaignCreation.formHelperDescription") }}
            </p>
            <b-form-checkbox
              v-if="editMode === true"
              switch
              size="lg"
              class="ps_gs-switch mb-3"
              v-model="campaignIsActive"
            >
              <span class="ps_gs-fz-14">
                {{ $t("cta.enabled") }}
              </span>
            </b-form-checkbox>
            <b-alert
              v-if="!productsHaveBeenApprovedByGoogle"
              variant="warning"
              show
            >
              {{ $t("smartShoppingCampaignCreation.errorNoProducts") }}
            </b-alert>
            <b-alert
              v-if="displayError"
              variant="danger"
              show
            >
              {{ $t("smartShoppingCampaignCreation.errorApi") }}
            </b-alert>
            <div class="d-md-flex text-center justify-content-end mt-3 pt-2">
              <b-button
                @click="cancel"
                size="sm"
                class="mx-1 mt-3 mt-md-0"
                variant="outline-secondary"
              >
                {{ $t("cta.cancel") }}
              </b-button>
              <b-button
                v-if="editMode"
                @click="openPopinRecap"
                size="sm"
                :disabled="disableCreateCampaign"
                class="mx-1 mt-3 mt-md-0 mr-md-0"
                variant="primary"
              >
                {{ $t("cta.editCampaign") }}
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
                {{ $t("cta.createCampaign") }}
              </b-button>
            </div>
          </b-form>
        </b-card-body>
        <SmartShoppingCampaignCreationPopin
          ref="SmartShoppingCampaignCreationPopin"
          @selectFilters="setDimensionFiltered"
          :loader="loader"
          :search-loader="searchLoader"
          :edit-mode="editMode"
        />
        <SmartShoppingCampaignCreationPopinRecap
          ref="SmartShoppingCampaignCreationPopinRecap"
          :new-campaign="finalCampaign"
          :total-products="totalProducts"
          :filters-exist="!campaignHasNoProductsFilter"
          @openPopinSSCCreated="onCampaignCreated"
          @displayErrorApiWhenSavingSSC="onDisplayErrorApi"
          :edition-mode="editMode"
        />
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script>
import countriesSelectionOptions from '@/assets/json/countries.json';
import SmartShoppingCampaignCreationPopin from './smart-shopping-campaign-creation-filter-popin/smart-shopping-campaign-creation-popin.vue';
import SmartShoppingCampaignCreationPopinRecap from './smart-shopping-campaign-creation-filter-popin/smart-shopping-campaign-creation-popin-recap.vue';
import SelectCountry from '../commons/select-country.vue';
import symbols from '../../assets/json/symbols.json';
import CampaignStatus, {CampaignTypes} from '@/enums/reporting/CampaignStatus';
import BannerAds from '@/components/commons/banner-ads.vue';
import {
  findAndCheckFilter,
  returnChildrenIds,
  returnCountProducts,
  deepCheckDimension,
  retrieveProductNumberFromFiltersIds,

} from '../../utils/SSCFilters';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import googleUrl from '@/assets/json/googleUrl.json';

export default {
  name: 'SmartShoppingCampaignCreation',
  data() {
    return {
      campaignName: null,
      campaignDurationStartDate: new Date(),
      campaignDurationEndDate: null,
      campaignHasNoProductsFilter: true,
      campaignDailyBudget: process.env.VUE_APP_SSC_DEFAULT_BUDGET,
      timer: null,
      displayError: false,
      campaignIsActive: true,
      targetCountry: null,
      loader: true,
      hasUnhandledFilters: false,
      totalProducts: 0,
      searchLoader: false,
      isBanner: true,
    };
  },
  components: {
    SmartShoppingCampaignCreationPopin,
    SmartShoppingCampaignCreationPopinRecap,
    SelectCountry,
    BannerAds,
  },
  props: {
    editMode: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    formTitle() {
      // Edition
      if (this.foundSsc) {
        if (this.foundSsc.type === this.$options.CampaignTypes.PERFORMANCE_MAX) {
          return this.$i18n.t('smartShoppingCampaignCreation.breadcrumbEditPMax');
        }
        return this.$i18n.t('smartShoppingCampaignCreation.breadcrumbEditSSC');
      }

      // Creation
      if (this.$route.params
      && this.$route.params.type === this.$options.CampaignTypes.SMART_SHOPPING) {
        return this.$i18n.t('smartShoppingCampaignCreation.breadcrumbCreateSSC');
      }
      return this.$i18n.t('smartShoppingCampaignCreation.breadcrumbCreatePMax');
    },
    dimensionName() {
      return this.$store.state.smartShoppingCampaigns.dimensionChosen.name;
    },
    filtersChosen() {
      return (
        this.foundSsc?.productFilters
        ?? this.$store.state.smartShoppingCampaigns.filtersChosen
      );
    },
    disableCreateCampaign() {
      if (
        this.campaignName
        && this.errorCampaignNameExistsAlready === false
        && this.campaignDurationStartDate
        && (this.targetCountry || this.defaultCountry())
        && this.campaignDailyBudget
      ) {
        return false;
      }
      return true;
    },
    campaignNameFeedback() {
      if (
        !this.campaignName?.length
        || this.errorCampaignNameExistsAlready === null
      ) {
        return null;
      }
      if (
        this.campaignName
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

      if (
        this.campaignDailyBudget === null
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
      return this.$store.getters[
        'smartShoppingCampaigns/GET_ERROR_CAMPAIGN_NAME'
      ];
    },
    currency() {
      return (
        this.foundSsc?.currencyCode
        || this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']
          ?.currencyCode || ''
      );
    },
    finalCampaignFilters() {
      // IMPORTANT: Do not send the filters property if the campaign has unhandled filters
      // or if we could not retrieve them
      if (this.hasUnhandledFilters) {
        return undefined;
      }
      if (this.errorFetchingFilters) {
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
        id: this.foundSsc?.id ?? 0,
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
          style: 'currency',
          currency: this.currency,
        });

        return currencyFormatted.replace(/[ .,0]*/, '');
      } catch (error) {
        const currency = symbols.find((c) => c.currency === this.currency);

        return currency ? currency.symbol : '';
      }
    },
    productsHaveBeenApprovedByGoogle() {
      return this.$store.state.productFeed.validationSummary.activeItems > 0;
    },
    errorFetchingFilters() {
      return this.$store.getters[
        'smartShoppingCampaigns/GET_ERROR_FETCHING_FILTERS_STATUS'
      ];
    },
    sscList() {
      return this.$store.getters['smartShoppingCampaigns/GET_ALL_CAMPAIGNS'];
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
      return this.$options.filters.changeCountriesCodesToNames([
        this.$store.state.app.psxMtgWithGoogleDefaultShopCountry,
      ])[0];
    },
    debounceName() {
      if (!this.campaignName.length) {
        return;
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.dispatch(
          'smartShoppingCampaigns/CHECK_CAMPAIGN_NAME_ALREADY_EXISTS',
          {
            name: this.campaignName,
            id: this.finalCampaign.id,
          },
        );
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
      this.targetCountry = value.toString();
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

    setDimensionFiltered(dimension) {
      this.totalProducts = returnCountProducts(dimension);
      const filtersForAPI = [
        {
          dimension: dimension.id,
          values: returnChildrenIds(dimension),
        },
      ];
      this.$store.commit(
        'smartShoppingCampaigns/SET_FILTERS_CHOSEN',
        filtersForAPI,
      );
      if (this.editMode) {
        this.foundSsc.productFilters = filtersForAPI;
      }
    },
    async getDatasFiltersDimensions(search) {
      this.searchLoader = true;
      await this.$store
        .dispatch('smartShoppingCampaigns/GET_DIMENSIONS_FILTERS', search).finally(() => {
          this.searchLoader = false;
        });
    },
    setInterfaceForCreation() {
      this.$store.commit('smartShoppingCampaigns/SET_DIMENSION_CHOSEN', {});
      this.$store.state.smartShoppingCampaigns.sscAvailableFilters.forEach(
        (dim) => {
          deepCheckDimension(dim, false);
        },
      );
    },
    setInterfaceForEdition() {
      let {endDate} = this.foundSsc;
      const todayYear = new Date().getFullYear();

      if (new Date(endDate).getFullYear() - 10 > todayYear) {
        endDate = null;
      }
      this.campaignName = this.foundSsc.campaignName;
      this.campaignDurationStartDate = this.foundSsc.startDate;
      this.campaignDurationEndDate = endDate;
      this.campaignHasNoProductsFilter = !this.foundSsc.productFilters.length
            && !this.foundSsc.hasUnhandledFilters;
      this.campaignDailyBudget = this.foundSsc.dailyBudget;
      this.campaignIsActive = this.foundSsc.status === CampaignStatus.ELIGIBLE;
      [this.targetCountry] = this.$options.filters.changeCountriesCodesToNames([
        this.foundSsc.targetCountry,
      ]);
      this.hasUnhandledFilters = this.foundSsc.hasUnhandledFilters;
      this.debounceName();
      this.$store.commit(
        'smartShoppingCampaigns/SET_FILTERS_CHOSEN',
        this.filtersChosen,
      );
      if (
        this.filtersChosen.length
            && this.$store.state.smartShoppingCampaigns.sscAvailableFilters.length
      ) {
        let dimensionToEdit = this.$store.state.smartShoppingCampaigns.sscAvailableFilters.find(
          (dim) => dim.id === this.filtersChosen[0].dimension,
        );
        dimensionToEdit = findAndCheckFilter(
          dimensionToEdit,
          this.filtersChosen[0].values,
        );
        this.$store.commit(
          'smartShoppingCampaigns/SET_DIMENSION_CHOSEN',
          dimensionToEdit,
        );
        this.totalProducts = retrieveProductNumberFromFiltersIds(
          this.filtersChosen,
          this.$store.state.smartShoppingCampaigns.sscAvailableFilters,
        );
      }
      this.loader = false;
    },
  },
  watch: {
    campaignName(oldVal, newVal) {
      if (newVal !== oldVal && this.errorCampaignNameExistsAlready !== null) {
        this.$store.commit(
          'smartShoppingCampaigns/SET_ERROR_CAMPAIGN_NAME_EXISTS',
          null,
        );
      }
    },
    $route: {
      handler(route) {
        if (route.name === 'campaign-creation'
        || route.name === 'campaign-creation-typed') {
          this.setInterfaceForCreation();
        }
      },
      deep: true,
      immediate: true,
    },
    dimensionName(oldVal, newVal) {
      if (newVal && newVal !== oldVal) {
        this.totalProducts = 0;
      }
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    if (this.productsHaveBeenApprovedByGoogle) {
      await this.getDatasFiltersDimensions();
    }
    if (this.editMode === true) {
      if (!this.sscList.length) {
        await this.$store.dispatch('smartShoppingCampaigns/GET_SSC_LIST',
          {isNewRequest: true, typeChosen: this.$options.CampaignTypes.PERFORMANCE_MAX});
      }
      this.setInterfaceForEdition();
    } else {
      this.loader = false;
    }
  },
  created() {
    this.$root.$on('filterByName', this.getDatasFiltersDimensions);
  },
  countriesSelectionOptions,
  googleUrl,
  CampaignTypes,
};
</script>
