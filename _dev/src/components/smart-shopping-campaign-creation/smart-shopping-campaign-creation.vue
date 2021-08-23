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
          label="Campaign name"
          label-for="campaign-name-input"
          label-class="font-weight-600"
        >
          <b-form-input
            id="campaign-name-input"
            v-model="campaignName"
            placeholder="Type campaign name"
            class="maxw-sm-420"
          />
        </b-form-group>
        <span class="font-weight-600">Campaign activation</span>
        <p>
          Your campaign will run until you pause it. You can pause your campaign at any time.
        </p>
        <b-form-group
          id="campaign-duration-fieldset"
          label="Campaign duration"
          label-class="h4 font-weight-600 border-0 bg-transparent"
          class="maxw-sm-420"
          description="We recommend a minimum duration of 30 days so that
           Google can optimize your campaign."
        >
          <b-form-row>
            <b-col>
              <label for="campaign-duration-start-date-input">Start date</label>
              <b-form-datepicker
                id="campaign-duration-start-date-input"
                v-model="campaignDurationStartDate"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
              />
            </b-col>
            <b-col>
              <label for="campaign-duration-end-date-input">End date</label>
              <b-form-datepicker
                id="campaign-duration-end-date-input"
                v-model="campaignDurationEndDate"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
              />
            </b-col>
          </b-form-row>
        </b-form-group>
        <b-form-group
          id="campaign-target-country-fieldset"
          label="Target country"
          label-for="campaign-target-country-input"
          label-class="font-weight-600"
        >
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
            <template #footer>
              <p
                class="text-muted my-1 ps_gs-fz-12"
              >
                To target multiple countries you have to create multiple campaigns.
              </p>
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
            value="A"
          >
            Include all synced products
          </b-form-radio>
          <b-form-radio
            v-model="campaignProductsFilter"
            name="campaign-product-filter-radios"
            value="B"
          >
            Select products using product partition filters
          </b-form-radio>
        </b-form-group>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<script>
import countriesSelectionOptions from '@/assets/json/countries.json';
import PsSelect from '../commons/ps-select.vue';

export default {
  name: 'ProductFeedSettings',
  data() {
    return {
      campaignName: '',
      campaignDurationStartDate: null,
      campaignDurationEndDate: null,
      campaignCountry: null,
      campaignProductsFilter: null,
    };
  },
  components: {
    PsSelect,
  },
  computed: {
  },
  methods: {
  },
  countriesSelectionOptions,
};
</script>
