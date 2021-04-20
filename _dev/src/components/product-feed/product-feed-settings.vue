<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard"
  >
    <b-card-header
      header-tag="nav"
      header-class="px-3 py-1"
    >
      <ol class="list-inline mb-0 d-flex align-items-center ps_gs-breadcrumb">
        <li class="list-inline-item ps_gs-breadcrumb__item">
          <a
            href=""
            class="d-flex align-items-center ps_gs-breadcrumb__link"
          >
            <img
              class="ps_gs-breadcrumb__icon"
              src="@/assets/images/product-feed-icon.svg"
              width="40"
              height="40"
              alt=""
            >
            Product feed
          </a>
        </li>
        <li class="list-inline-item ps_gs-breadcrumb__item">Product feed settings</li>
      </ol>
    </b-card-header>
    <b-card-body
      body-class="p-4"
    >
      <stepper
        :steps="steps"
      />
      <b-form>
        <h3 class="h4 mb-2">Target countries</h3>
        <p>
          If multiple countries are selected, each product price will automatically be converted to the correct currency in Google. Your store must support the appropriate shipping and tax rates for customers in each selected country.
        </p>
        <label class="mb-2">
          Products available in
        </label>
        <b-dropdown
          id="countrySelection"
          ref="countrySelection"
          variant=" "
          :text="selectedCountry || 'Placeholder text'"
          class="ps-dropdown ps_googleshopping-dropdown bordered"
          menu-class="ps-dropdown"
          multiple
          no-flip
        >
          <b-dropdown-item
            v-for="option in countrySelectionOptions"
            :key="option.text"
            @click="selectedCountry = option.text"
          >
            {{ option.text }}
          </b-dropdown-item>
        </b-dropdown>
        <p class="text-muted my-1 ps_gs-fz-12">
          Can’t find a country? Only supported countries are listed.
          <a class="d-inline-block" href="//google.com" target="_blank">Supported countries</a>
        </p>
        <h3 class="h4 mt-4 mb-2">Shipping settings</h3>
        <b-form-group>
          <b-form-radio
            v-model="selectedShippingSettings"
            name="some-radios"
            id="shippingSettingsAuto"
            value="shippingSettingsAuto"
          >
            <div>
              <h4 class="font-weight-normal mb-1">Automatically import shipping settings</h4>
              <p class="text-muted ps_gs-fz-12">
                PrestaShop will try to automatically import your shipping information from your store settings. You may need to provide additional information if we are unable to sync them automatically.
              </p>
            </div>
          </b-form-radio>
          <b-form-radio
            v-model="selectedShippingSettings"
            name="some-radios"
            id="shippingSettingsManual"
            value="shippingSettingsManual"
          >
            <div>
              <h4 class="font-weight-normal mb-1">Manually set up shipping settings in Google Merchant Center</h4>
              <p class="text-muted ps_gs-fz-12">
                You will go to Google Merchant Center and enter your product shipping information yourself. Your products won’t sync until you do this.
              </p>
            </div>
          </b-form-radio>
        </b-form-group>
        <div class="d-md-flex text-center justify-content-end">
          <b-button
            class="mx-2 mt-3 mt-md-0"
            variant="outline-secondary"
          >
            Cancel
          </b-button>
          <b-button
            disabled
            class="mx-2 mt-3 mt-md-0 mr-md-0"
            variant="primary"
          >
            Continue
          </b-button>
        </div>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<script>
import Stepper from '../commons/stepper';

export default {
  name: 'ProductFeedSettings',
  components: {
    Stepper
  },
  data() {
    return {
      selectedCountry: null,
      selectedShippingSettings: null,
      countrySelectionOptions: [
        { value: null, text: 'Please select an option' },
        { value: 'FR', text: 'France' },
        { value: 'BE', text: 'Belgium' },
      ],
      steps: [
        {
          title: "Shipping settings",
          active: true,
        },
        {
          title: "Export rules",
        },
        {
          title: "Attribute mapping",
        },
        {
          title: "Category mapping",
        },
        {
          title: "Summary",
        },
      ],
    };
  },
};
</script>
