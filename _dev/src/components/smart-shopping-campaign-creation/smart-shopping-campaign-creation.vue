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
            {{ $t('smartShoppingCampaingCreation.breadcrumb1') }}
          </a>
        </li>
        <li class="list-inline-item ps_gs-breadcrumb__item ml-4 ml-sm-0">
          {{ $t('smartShoppingCampaingCreation.breadcrumb2') }}
        </li>
      </ol>
    </b-card-header>
    <b-card-body
      body-class="p-3 p-md-4"
    >
      <b-form>
        <b-form-group
          id="campaign-name-fieldset"
          :description="$t('smartShoppingCampaingCreation.inputNameHelper')"
          label-for="campaign-name-input"
          label-class="d-flex align-items-center font-weight-600"
        >
          <template #label>
            {{ $t('smartShoppingCampaingCreation.inputNameLabel') }}
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="$t('smartShoppingCampaingCreation.inputNameTooltip')"
            >
              <span class="material-icons-round mb-0 ps_gs-fz-16 text-primary">
                error_outline
              </span>
            </b-button>
          </template>
          <b-form-input
            id="campaign-name-input"
            v-model="campaignName"
            :placeholder="$t('smartShoppingCampaingCreation.inputNamePlaceholder')"
            class="maxw-sm-420"
            :state="campaignNameFeedback"
          />
        </b-form-group>
        <b-form-group
          id="campaign-duration-fieldset"
          class="maxw-sm-420"
          :description="$t('smartShoppingCampaingCreation.inputDurationHelper')"
          label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
        >
          <template #label>
            {{ $t('smartShoppingCampaingCreation.inputDurationLabel') }}
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="$t('smartShoppingCampaingCreation.inputDurationTooltip')"
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
                {{ $t('smartShoppingCampaingCreation.inputDurationLabel1') }}
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
                :label-help="$t('smartShoppingCampaingCreation.inputDatePickerHelper')"
                :required="true"
              />
            </b-col>
            <b-col
              cols="12"
              md="6"
            >
              <label for="campaign-duration-end-date-input">
                {{ $t('smartShoppingCampaingCreation.inputDurationLabel2') }}
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
                :label-help="$t('smartShoppingCampaingCreation.inputDatePickerHelper')"
                :required="false"
              />
            </b-col>
          </b-form-row>
        </b-form-group>
        <b-form-group
          id="campaign-target-country-fieldset"
          label-class="d-flex align-items-center font-weight-600"
          label-for="campaign-target-country-input"
          :description="$t('smartShoppingCampaingCreation.inputCountryHelper')"
        >
          <template #label>
            {{ $t('smartShoppingCampaingCreation.inputCountryLabel') }}
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="$t('smartShoppingCampaingCreation.inputCountryTooltip')"
            >
              <span class="material-icons-round mb-0 ps_gs-fz-16 text-primary">
                error_outline
              </span>
            </b-button>
          </template>
          <ps-select
            v-model="campaignCountry"
            :placeholder="$t('productFeedSettings.shipping.placeholderSelect')"
            :reduce="country => country.code"
            :options="$options.countriesSelectionOptions"
            :deselect-from-dropdown="true"
            :clearable="false"
            class="ps_gs-v-select maxw-sm-420"
            label="country"
          >
            <template #search="{ attributes, events }">
              <input
                class="vs__search"
                v-bind="attributes"
                v-on="events"
                id="campaign-target-country-input"
              >
            </template>
            <template #option="{ country }">
              <div class="d-flex flex-wrap flex-md-nowrap align-items-center pr-3">
                <span class="mr-2">
                  {{ country }}
                </span>
              </div>
            </template>
          </ps-select>
        </b-form-group>
        <b-form-group
          :label="$t('smartShoppingCampaingCreation.inputFiltersLegend')"
          id="campaign-products-filter-fieldset"
          label-class="h4 font-weight-600 border-0 bg-transparent"
        >
          <b-form-radio
            v-model="campaignProductsFilter"
            name="campaign-product-filter-radios"
            :value="true"
            class="mb-1"
          >
            {{ $t('smartShoppingCampaingCreation.inputFiltersAllLabel') }}
          </b-form-radio>
          <b-form-radio
            v-model="campaignProductsFilter"
            name="campaign-product-filter-radios"
            :value="false"
          >
            {{ $t('smartShoppingCampaingCreation.inputFiltersPartialLabel') }}
          </b-form-radio>
          <template #description>
            <VueShowdown
              tag="p"
              class="mb-0"
              :markdown="$t('smartShoppingCampaingCreation.inputFiltersHelper', ['//google.com'])"
              :extensions="['extended-link', 'no-p-tag']"
            />
          </template>
        </b-form-group>

        <!-- TODO START > Ajout de filtres dynamiques -->
        <b-form-group
          v-if="campaignProductsFilter === false"
          class="maxw-sm-420"
        >
          <ul class="ps_gs-categories-list">
            <SmartShoppingCampaignCreationFilterItem
              :item="$options.treeFilters"
            />
          </ul>
        </b-form-group>
        <!-- TODO END > Ajout de filtres dynamiques -->
        <b-form-group
          id="campaign-daily-budget-fieldset"
          :description="$t('smartShoppingCampaingCreation.inputBudgetHelper')"
          label-for="campaign-dailyBudget-input"
          label-class="d-flex align-items-center font-weight-600"
          :state="campaignDailyBudgetFeedback"
          aria-describedby="campaign-daily-budget-fieldset__BV_description_ input-live-feedback"
          :invalid-feedback="$t('smartShoppingCampaingCreation.inputBudgetInvalidFeedback')"
        >
          <template #label>
            {{ $t('smartShoppingCampaingCreation.inputBudgetFeedback') }}
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="$t('smartShoppingCampaingCreation.inputBudgetTooltip')"
            >
              <span class="material-icons-round mb-0 ps_gs-fz-16 text-primary">
                error_outline
              </span>
            </b-button>
          </template>
          <b-input-group
            :prepend="budgetCurrencySymbol"
            :append="budgetCurrencyAbbreviation"
            class="maxw-sm-420"
          >
            <b-form-input
              id="campaign-dailyBudget-input"
              v-model="campaignDailyBudget"
              :placeholder="$t('smartShoppingCampaingCreation.inputBudgetPlaceholder')"
              :state="campaignDailyBudgetFeedback"
            />
          </b-input-group>
        </b-form-group>
        <span class="font-weight-600">
          {{ $t('smartShoppingCampaingCreation.formHelperTitle') }}
        </span>
        <p>
          {{ $t('smartShoppingCampaingCreation.formHelperDescription') }}
        </p>
        <b-alert
          variant="warning"
          show
        >
          {{ $t('smartShoppingCampaingCreation.errorNoProducts') }}
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
            @click="createCampaign"
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
  </b-card>
</template>

<script>
import countriesSelectionOptions from '@/assets/json/countries.json';
import PsSelect from '../commons/ps-select.vue';

// ! test
import SmartShoppingCampaignCreationFilterItem from './smart-shopping-campaign-creation-filter-item.vue';

export default {
  name: 'SmartShoppingCampaignCreation',
  data() {
    return {
      campaignName: null,
      campaignDurationStartDate: new Date(),
      campaignDurationEndDate: null,
      campaignCountry: null,
      campaignProductsFilter: null,
      campaignDailyBudget: null,
      budgetCurrencySymbol: '$',
      budgetCurrencyAbbreviation: 'USD',
    };
  },
  components: {
    PsSelect,
    SmartShoppingCampaignCreationFilterItem,
  },
  computed: {
    disableCreateCampaign() {
      // TODO
      // Condition to allow user to create campaign
      return true;
    },
    campaignNameFeedback() {
      // TODO
      // Check if length < 125 and if name is unique
      const isUnique = true;
      if ((this.campaignName == null) || this.campaignName === '') {
        return null;
      }

      return !!((this.campaignName.length <= 125
          && this.campaignName.length > 0
          && isUnique));
    },
    campaignDailyBudgetFeedback() {
      // TODO
      // I'm just looking for digit, validation should be way better than that
      const regex = /^(?:\d)+$/g;
      if (this.campaignDailyBudget === null || this.campaignDailyBudget === '') {
        return null;
      }

      return !!regex.test(this.campaignDailyBudget);
    },
  },
  methods: {
    cancel() {
      // TODO
    },
    createCampaign() {
      // TODO
    },
    addFilter() {
      // TODO
    },
  },
  // TODO filter country to show only available countries
  countriesSelectionOptions,

  // TODO Getting datas
  // TODO Adding translation
  treeFilters: {
    name: 'All filters',
    children: [
      {
        name: 'Bidding category',
      },
      {
        name: 'Canonical condition',
        children: [
          {
            name: 'NEW',
          },
          {
            name: 'USED',
          },
          {
            name: 'REFURBISHED',
          },
          {
            name: 'UNKNOWN',
          },
        ],
      },
      {
        name: 'Brands',
        children: [
          {
            name: 'Nike',
          },
          {
            name: 'Reebok',
          },
          {
            name: 'Jouet Club',
            children: [
              {
                name: 'Hasbro',
              },
              {
                name: 'Mattel',
              },
              {
                name: 'Kenner',
              },
              {
                name: 'Poly pocket',
              },
            ],
          },
        ],
      },
      {
        name: 'Custom attribute',
      },
      {
        name: 'Offer ID',
      },
      {
        name: 'Product type',
      },
    ],
  },
};
</script>
