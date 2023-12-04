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
                class="text-decoration-underline"
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
              label-class="d-flex align-items-center ps_gs-fz-16 font-weight-500"
              :state="campaignNameFeedback"
              :invalid-feedback="campaignNameFeedbackMessage"
            >
              <template #label>
                {{ $t("smartShoppingCampaignCreation.inputNameLabel") }}
                <b-button
                  class="ml-1 p-0 d-flex align-items-center"
                  variant="text-primary"
                  v-b-tooltip:psxMktgWithGoogleApp
                  :title="$t('smartShoppingCampaignCreation.inputNameTooltip')"
                >
                  <span class="material-icons-round mb-0 text-secondary">
                    help_outline
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
              label-class="border-0 bg-transparent d-flex align-items-center
                ps_gs-fz-16 font-weight-500"
              label-for="campaign-duration-start-date-input"
            >
              <template #label>
                {{ $t("smartShoppingCampaignCreation.inputDurationLabel") }}
                <b-button
                  class="ml-1 p-0 d-flex align-items-center"
                  variant="text-primary"
                  v-b-tooltip:psxMktgWithGoogleApp
                  :title="$t('smartShoppingCampaignCreation.inputDurationTooltip')"
                >
                  <span class="material-icons-round mb-0 ps_gs-fz-16 text-secondary">
                    help_outline
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
                    :min="minimunEndDate"
                    reset-button
                    :label-reset-button="$t('cta.noEndDate')"
                    reset-button-variant="outline-secondary sm"
                    :hide-header="true"
                    :label-help="
                      $t('smartShoppingCampaignCreation.inputDatePickerHelper')
                    "
                    :required="false"
                    :state="campaignEndDateFeedback"
                    class="ps_gs-datepicker"
                    menu-class="ps_gs-datepicker-end"
                  />
                  <b-form-invalid-feedback
                    id="campaign-duration-end-date-input-feedback"
                    :class="{'d-block': campaignEndDateFeedback === false}"
                  >
                    {{ $t('smartShoppingCampaignCreation.inputDurationInvalidFeedback') }}
                  </b-form-invalid-feedback>
                </b-col>
              </b-form-row>
            </b-form-group>
            <b-form-group
              id="campaign-target-country-fieldset"
              label-class="d-flex align-items-center ps_gs-fz-16 font-weight-500"
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
                  <span class="material-icons-round mb-0 ps_gs-fz-16 text-secondary">
                    help_outline
                  </span>
                </b-button>
              </template>
              <SelectCountry
                v-if="!editMode"
                @countrySelected="saveCountrySelected"
                :default-value="defaultCountry"
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
              label-class="font-weight-600 border-0 bg-transparent ps_gs-fz-16 font-weight-500"
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
                    && !hasUnhandledFilters
                    && dimensionName"
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
              :description="!campaignDailyBudgetFeedback.error && (!recommendedBudget
                ? $t('smartShoppingCampaignCreation.inputBudgetHelper')
                : $t('smartShoppingCampaignCreation.inputBudgetHelperForTargetCountry', {
                  country: changeCountryCodeToName(targetAudienceCountry),
                  budget: formattedRecommendedBudget,
                })) || undefined"
              label-for="campaign-dailyBudget-input"
              label-class="d-flex align-items-center ps_gs-fz-16 font-weight-500"
              :state="campaignDailyBudgetFeedback.result"
              aria-describedby="campaign-daily-budget-fieldset__BV_description_ input-live-feedback"
              :invalid-feedback="campaignDailyBudgetFeedback.error"
            >
              <template #label>
                {{ $t("smartShoppingCampaignCreation.inputBudgetFeedback") }}
                <b-button
                  class="ml-1 p-0 d-flex align-items-center"
                  variant="text-primary"
                  v-b-tooltip:psxMktgWithGoogleApp
                  :title="$t('smartShoppingCampaignCreation.inputBudgetTooltip')"
                >
                  <i class="material-icons-round mb-0 ps_gs-fz-16 text-secondary">
                    help_outline
                  </i>
                </b-button>
              </template>
              <b-input-group
                data-test-id="campaign-dailyBudget-input-group"
                :prepend="currencySymbol"
                :append="currency"
                class="maxw-sm-420"
              >
                <b-form-input
                  type="number"
                  data-test-id="campaign-dailyBudget-input"
                  id="campaign-dailyBudget-input"
                  :value="budgetInput"
                  @change="campaignDailyBudget = $event"
                  :placeholder="
                    $t('smartShoppingCampaignCreation.inputBudgetPlaceholder')
                  "
                  :state="campaignDailyBudgetFeedback.result"
                />
              </b-input-group>
            </b-form-group>
            <TipsAndTricksCard
              v-if="recommendedBudget"
              class="col-8"
              :content="$t('smartShoppingCampaignCreation.budgetTip.content', {
                country: changeCountryCodeToName(targetAudienceCountry),
                budget: formattedRecommendedBudget,
              })"
            />

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
        <CampaignCreationPopin
          ref="CampaignCreationPopin"
          @selectFilters="setDimensionFiltered"
          :loader="loader"
          :search-loader="searchLoader"
          :edit-mode="editMode"
        />
        <CampaignCreationPopinRecap
          ref="CampaignCreationPopinRecap"
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

<script lang="ts">
import {defineComponent} from 'vue';
import countriesSelectionOptions from '@/assets/json/countries.json';
import CampaignCreationPopin from './campaign-creation-filter-popin/campaign-creation-popin.vue';
import CampaignCreationPopinRecap from './campaign-creation-filter-popin/campaign-creation-popin-recap.vue';
import SelectCountry from '../commons/select-country.vue';
import CampaignStatus, {CampaignStatusToggle, CampaignTypes} from '@/enums/reporting/CampaignStatus';
import BannerAds from '@/components/commons/banner-ads.vue';
import TipsAndTricksCard from '@/components/commons/tips-and-tricks-card.vue';
import {
  findAndCheckFilter,
  returnChildrenIds,
  deepCheckDimension,
  returnCountProducts,

} from '@/utils/SSCFilters';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import googleUrl from '@/assets/json/googleUrl.json';
import {formatPrice} from '@/utils/Price';
import {RecommendedBudget} from '@/utils/CampaignsBudget';
import {changeCountryCodeToName, changeCountryNameToCode} from '@/utils/Countries';

export default defineComponent({
  name: 'CampaignCreation',
  data() {
    return {
      campaignName: null as string|null,
      campaignDurationStartDate: new Date(),
      campaignDurationEndDate: null,
      campaignHasNoProductsFilter: true,
      campaignDailyBudget: null as string|null,
      timer: null,
      displayError: false,
      campaignIsActive: true,
      targetCountry: null as string|null,
      loader: true,
      hasUnhandledFilters: false,
      searchLoader: false,
      isBanner: true,
      recommendedBudget: null as RecommendedBudget|null,
    };
  },
  components: {
    CampaignCreationPopin,
    CampaignCreationPopinRecap,
    SelectCountry,
    BannerAds,
    TipsAndTricksCard,
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
      if (this.campaignToEditFromList) {
        return this.$i18n.t('smartShoppingCampaignCreation.breadcrumbEditPMax');
      }

      return this.$i18n.t('smartShoppingCampaignCreation.breadcrumbCreatePMax');
    },
    dimensionName() {
      return this.$store.state.campaigns.dimensionChosen.name;
    },
    filtersChosen() {
      return (
        this.campaignToEditFromList?.productFilters
        ?? this.$store.state.campaigns.filtersChosen
      );
    },
    disableCreateCampaign() {
      if (
        this.campaignNameFeedback === true
        && this.campaignDurationStartDate
        && this.targetAudienceCountry
        && this.campaignDailyBudgetFeedback.result === true
        && this.campaignEndDateFeedback !== false
      ) {
        return false;
      }
      return true;
    },
    minimunEndDate() {
      return new Date(Math.max(new Date(this.campaignDurationStartDate), new Date()));
    },
    campaignNameFeedback(): boolean|null {
      if (
        !this.campaignName?.length
        || this.errorCampaignNameExistsAlready === null
      ) {
        return null;
      }
      // No error message? All good
      return this.campaignNameFeedbackMessage === null;
    },
    campaignNameFeedbackMessage(): string|null {
      if (this.campaignName && this.campaignName.length > 125) {
        return this.$t('smartShoppingCampaignCreation.inputCampaignNameTooLongFeedback');
      }
      if (
        !this.campaignName
        || this.campaignName.length <= 0
        || this.errorCampaignNameExistsAlready === true
      ) {
        return this.$t('smartShoppingCampaignCreation.inputCampaignNameInvalidFeedback');
      }
      return null;
    },
    campaignEndDateFeedback() {
      if (this.campaignDurationEndDate
        && new Date(this.campaignDurationEndDate) < this.minimunEndDate
      ) {
        // Show as NOK
        return false;
      }

      // No feedback to display, either OK or NOK
      return null;
    },
    campaignDailyBudgetFeedback(): {result: boolean|null, error?: TranslateResult} {
      const regex = /^[0-9]+([.][0-9]{0,2})?$/g;

      if (
        this.budgetInput === null
        || this.budgetInput === ''
      ) {
        return {
          result: null,
        };
      }
      if (+this.budgetInput < 1 || !regex.test(this.budgetInput)) {
        return {
          result: false,
          error: this.$t('smartShoppingCampaignCreation.inputBudgetInvalidFeedback'),
        };
      }

      if (this.recommendedBudget === null) {
        return {
          result: null,
        };
      }

      if (+this.budgetInput < this.recommendedBudget.value) {
        return {
          result: false,
          error: this.$t(
            'smartShoppingCampaignCreation.inputBudgetBeforeThresholdFeedback',
            {
              budget: this.formattedRecommendedBudget,
            },
          ),
        };
      }

      return {
        result: true,
      };
    },
    errorCampaignNameExistsAlready() {
      return this.$store.getters[
        'campaigns/GET_ERROR_CAMPAIGN_NAME'
      ];
    },
    currency() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']
        ?.currencyCode;
    },
    currencySymbol(): string {
      return this.$options.filters.formatPrice(0, this.currency).replace(/[\s.,0]*/g, '');
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
        id: this.campaignToEditFromList?.id ?? 0,
        campaignName: this.campaignName,
        dailyBudget: Number(this.campaignDailyBudget) || this.recommendedBudget?.value,
        currencyCode: this.currency,
        startDate: this.campaignDurationStartDate,
        endDate: this.campaignDurationEndDate,
        targetCountry: this.targetAudienceCountry,
        productFilters: this.finalCampaignFilters,
        status: this.campaignIsActive ? CampaignStatusToggle.ENABLED : CampaignStatusToggle.PAUSED,
      };
    },
    productsHaveBeenApprovedByGoogle() {
      return this.$store.state.productFeed.validationSummary.activeProducts > 0;
    },
    errorFetchingFilters() {
      return this.$store.getters[
        'campaigns/GET_ERROR_FETCHING_FILTERS_STATUS'
      ];
    },
    campaignsList() {
      return this.$store.getters['campaigns/GET_CAMPAIGNS_LIST'];
    },
    campaignToEditFromList() {
      return this.campaignsList.find((el) => el.id === this.$route.params.id);
    },
    activeCountries() {
      return this.$store.getters['app/GET_ACTIVE_COUNTRIES'];
    },
    defaultCountry(): string {
      if (!this.$store.state.app.psxMtgWithGoogleDefaultShopCountry) {
        return '';
      }
      return changeCountryCodeToName(
        this.$store.state.app.psxMtgWithGoogleDefaultShopCountry,
      );
    },
    targetAudienceCountry(): string {
      return this.targetCountry || this.defaultCountry;
    },
    formattedRecommendedBudget(): string {
      return formatPrice(this.recommendedBudget.value, this.recommendedBudget.currency);
    },
    budgetInput(): string|number {
      return this.campaignDailyBudget ?? this.recommendedBudget?.value ?? '';
    },
    totalProducts(): number {
      return returnCountProducts(
        this.$store.state.campaigns.dimensionChosen,
      );
    },
  },
  methods: {
    changeCountryCodeToName,
    debounceName() {
      if (!this.campaignName?.length) {
        return;
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.dispatch(
          'campaigns/CHECK_CAMPAIGN_NAME_ALREADY_EXISTS',
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
        this.$refs.CampaignCreationPopinRecap.$refs.modal.id,
      );
    },
    saveCountrySelected(values: string[]) {
      this.targetCountry = values.length ? values[0] : this.defaultCountry;
      this.getRecommendedBudget(this.targetCountry);
      if (!Number(this.campaignDailyBudget)) {
        this.campaignDailyBudget = null;
      }
    },
    openFilterPopin() {
      this.$bvModal.show(
        this.$refs.CampaignCreationPopin.$refs.modal.id,
      );

      this.getDatasFiltersDimensions();
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
      const filtersForAPI = [
        {
          dimension: dimension.id,
          values: returnChildrenIds(dimension),
        },
      ];
      this.$store.commit(
        'campaigns/SET_FILTERS_CHOSEN',
        filtersForAPI,
      );
      if (this.editMode) {
        this.campaignToEditFromList.productFilters = filtersForAPI;
      }
    },
    getDatasFiltersDimensions(search) {
      this.searchLoader = true;
      this.$store
        .dispatch('campaigns/GET_DIMENSIONS_FILTERS', search).then(() => {
          this.updateDimensionCheckedValuesFromFiltersChosen();
        }).finally(() => {
          this.searchLoader = false;
        });
    },
    updateDimensionCheckedValuesFromFiltersChosen(): void {
      if (
        !this.filtersChosen.length
          || !this.$store.state.campaigns.sscAvailableFilters.length
      ) {
        return;
      }

      let dimensionToEdit = this.$store.state.campaigns.sscAvailableFilters.find(
        (dim) => dim.id === this.filtersChosen[0].dimension,
      );

      dimensionToEdit = findAndCheckFilter(
        dimensionToEdit,
        this.filtersChosen[0].values,
      );
      this.$store.commit(
        'campaigns/SET_DIMENSION_CHOSEN',
        dimensionToEdit,
      );
    },
    setInterfaceForCreation() {
      this.$store.commit('campaigns/SET_DIMENSION_CHOSEN', {});
      this.$store.state.campaigns.sscAvailableFilters.forEach(
        (dim) => {
          deepCheckDimension(dim, false);
        },
      );
    },
    setInterfaceForEdition() {
      let {endDate} = this.campaignToEditFromList;
      const todayYear = new Date().getFullYear();

      if (new Date(endDate).getFullYear() - 10 > todayYear) {
        endDate = null;
      }
      this.campaignName = this.campaignToEditFromList.campaignName;
      this.campaignDurationStartDate = this.campaignToEditFromList.startDate;
      this.campaignDurationEndDate = endDate;
      this.campaignHasNoProductsFilter = !this.campaignToEditFromList.productFilters.length
            && !this.campaignToEditFromList.hasUnhandledFilters;
      this.campaignDailyBudget = this.campaignToEditFromList.dailyBudget;
      this.campaignIsActive = this.campaignToEditFromList.status === CampaignStatus.ELIGIBLE;
      this.targetCountry = changeCountryCodeToName(
        this.campaignToEditFromList.targetCountry,
      );
      this.hasUnhandledFilters = this.campaignToEditFromList.hasUnhandledFilters;
      this.debounceName();
      this.$store.commit(
        'campaigns/SET_FILTERS_CHOSEN',
        this.filtersChosen,
      );
      this.loader = false;
    },

    async getRecommendedBudget(countryName: string): Promise<void> {
      const countryIsoCode = changeCountryNameToCode(countryName);
      this.recommendedBudget = await this.$store.dispatch('campaigns/GET_RECOMMENDED_BUDGET', countryIsoCode) as RecommendedBudget;
    },
  },
  watch: {
    campaignName(oldVal, newVal) {
      if (newVal !== oldVal && this.errorCampaignNameExistsAlready !== null) {
        this.$store.commit(
          'campaigns/SET_ERROR_CAMPAIGN_NAME_EXISTS',
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
  },
  async mounted() {
    window.scrollTo(0, 0);

    if (this.editMode === true) {
      if (!this.campaignsList.length) {
        await this.$store.dispatch('campaigns/GET_CAMPAIGNS_LIST');
      }
      if (!this.campaignToEditFromList) {
        this.$router.push({
          name: 'campaign',
        });
        return;
      }
      this.setInterfaceForEdition();
    } else {
      this.loader = false;
    }
    if (!this.currency) {
      await this.$store.dispatch('googleAds/WARMUP_STORE');
    }
    this.getDatasFiltersDimensions();

    this.getRecommendedBudget(this.targetAudienceCountry);
  },
  created() {
    this.$root.$on('filterByName', this.getDatasFiltersDimensions);
  },
  countriesSelectionOptions,
  googleUrl,
  CampaignTypes,
});
</script>
