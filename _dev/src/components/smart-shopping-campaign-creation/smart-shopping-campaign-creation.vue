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
            Paid marketing
          </a>
        </li>
        <li class="list-inline-item ps_gs-breadcrumb__item ml-4 ml-sm-0">
          Create Smart Shopping campaign
        </li>
      </ol>
    </b-card-header>
    <b-card-body
      body-class="p-3 p-md-4"
    >
      <b-form>
        <b-form-group
          id="campaign-name-fieldset"
          description="The name must be unique and 125 chars max."
          label-for="campaign-name-input"
          label-class="d-flex align-items-center font-weight-600"
        >
          <template #label>
            Campaign name
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              title="Choose a name that clearly describes the theme of the campaign so that you can easily find it in your account. Your campaign name isn't visible to your customers."
            >
              <span class="material-icons-round mb-0 ps_gs-fz-16 text-primary">
                error_outline
              </span>
            </b-button>
          </template>
          <b-form-input
            id="campaign-name-input"
            v-model="campaignName"
            placeholder="Type campaign name"
            class="maxw-sm-420"
            :state="campaignNameFeedback"
          />
        </b-form-group>
        <b-form-group
          id="campaign-duration-fieldset"
          class="maxw-sm-420"
          description="We recommend a minimum duration of 30 days so that
           Google can optimize your campaign."
          label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
        >
          <template #label>
            Campaign duration
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              title="Ad campaigns have no end date by default, so that the ads are able to run indefinitely. You can always add an end date to create a shorter campaign."
            >
              <span class="material-icons-round mb-0 ps_gs-fz-16 text-primary">
                error_outline
              </span>
            </b-button>
          </template>
          <b-form-row>
            <b-col>
              <label for="campaign-duration-start-date-input">Start date</label>
              <b-form-datepicker
                id="campaign-duration-start-date-input"
                v-model="campaignDurationStartDate"
                :min="new Date()"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                reset-button
                label-reset-button="Reset date"
                :reset-value="new Date()"
                reset-button-variant="outline-secondary sm"
                hide-header="true"
                label-help="Use cursor keys to navigate calendar dates"
                required="true"
              />
            </b-col>
            <b-col>
              <label for="campaign-duration-end-date-input">End date (optional)</label>
              <b-form-datepicker
                id="campaign-duration-end-date-input"
                v-model="campaignDurationEndDate"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                :min="new Date()"
                reset-button
                label-reset-button="Reset date"
                reset-button-variant="outline-secondary sm"
                hide-header="true"
                label-help="Use cursor keys to navigate calendar dates"
                required="false"
              />
            </b-col>
          </b-form-row>
        </b-form-group>
        <b-form-group
          id="campaign-target-country-fieldset"
          label-class="d-flex align-items-center font-weight-600"
          label-for="campaign-target-country-input"
          description="To target multiple countries you have to create multiple campaigns."
        >
          <template #label>
            Target country
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              title="Your campaign’s ads are eligible to show to customers in your targeted geographic locations, or to customers who have selected your targeted language as their browser’s language setting."
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
          label="Products in campaign"
          id="campaign-products-filter-fieldset"
          label-class="h4 font-weight-600 border-0 bg-transparent"
        >
          <b-form-radio
            v-model="campaignProductsFilter"
            name="campaign-product-filter-radios"
            :value="true"
            class="mb-1"
          >
            Include all synced products
          </b-form-radio>
          <b-form-radio
            v-model="campaignProductsFilter"
            name="campaign-product-filter-radios"
            :value="false"
          >
            Select products using product partition filters
          </b-form-radio>
          <template #description>
            <VueShowdown
              tag="p"
              class="mb-0"
              markdown='Take some time to [read Google Shopping ads policies](//google.com)[:target="_blank"] some product are prohibited or restricted.'
              :extensions="['extended-link', 'no-p-tag']"
            />
          </template>
        </b-form-group>
        <!-- TODO START > Ajout de filtres dynamiques -->
        <b-form-group
          v-if="campaignProductsFilter === false"
          class="maxw-sm-420"
        >
          <b-form-row>
            <b-col>
              Filter by
            </b-col>
            <b-col>
              Dimension value
            </b-col>
          </b-form-row>
          <b-button
            variant="invisible"
            class="text-secondary"
            @click="addFilter"
          >
            + Add filter
          </b-button>
        </b-form-group>
        <!-- TODO END > Ajout de filtres dynamiques -->
        <b-form-group
          id="campaign-daily-budget-fieldset"
          description="You will only pay if someone clicks your ad."
          label-for="campaign-dailyBudget-input"
          label-class="d-flex align-items-center font-weight-600"
          :state="campaignDailyBudgetFeedback"
          aria-describedby="campaign-daily-budget-fieldset__BV_description_ input-live-feedback"
          invalid-feedback="placholder invalid feedback"
        >
          <template #label>
            Daily campaign budget
            <b-button
              class="ml-1 p-0 d-flex align-items-center"
              variant="text-primary"
              v-b-tooltip:psxMktgWithGoogleApp
              title="Your budget is the average amount you’re comfortable spending each day on your campaign. The budget you choose is entirely up to you, and you can adjust it at any time."
            >
              <span class="material-icons-round mb-0 ps_gs-fz-16 text-primary">
                error_outline
              </span>
            </b-button>
          </template>
          <b-input-group
            prepend="$"
            append="USD"
            class="maxw-sm-420"
          >
            <b-form-input
              id="campaign-dailyBudget-input"
              v-model="campaignDailyBudget"
              placeholder="Amount"
              :state="campaignDailyBudgetFeedback"
            />
          </b-input-group>
        </b-form-group>
        <span class="font-weight-600">Campaign activation</span>
        <p>
          Your campaign will run until you pause it. You can pause your campaign at any time.
        </p>
        <b-alert
          variant="warning"
          show
        >
          You want to launch a campaign, but your Google merchant center does not contain any products yet. Your campaign will start only when at least one product has been approved by Google.
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
            Create campaign
          </b-button>
        </div>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<script>
import countriesSelectionOptions from '@/assets/json/countries.json';
import PsSelect from '../commons/ps-select.vue';

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
    };
  },
  components: {
    PsSelect,
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
      let isUnique = true;
      if ((this.campaignName == null) || this.campaignName == '') {
        return null;
      }
      else {
        return (this.campaignName.length <= 125
          && this.campaignName.length > 0
          && isUnique) ? true : false;
      }
    },
    campaignDailyBudgetFeedback() {
      // TODO
      // I'm just looking for digit, validation should be way better than that
      var regex = /^(?:\d)+$/g;
      if (this.campaignDailyBudget === null || this.campaignDailyBudget === '') {
        return null;
      }
      else {
        return regex.test(this.campaignDailyBudget) ? true : false;
      };
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
  countriesSelectionOptions,
};
</script>
