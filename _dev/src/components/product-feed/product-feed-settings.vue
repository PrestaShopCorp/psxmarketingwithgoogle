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
      body-class="px-3 py-4"
    >
      <b-form>
        <b-container fluid>
          <b-form-row>
            <b-col
              cols="12"
              md="3"
              class="text-md-right"
            >
              <strong>Target countries</strong>
            </b-col>
            <b-col cols="12" md="9">
              <p>
                If multiple countries are selected, each product price will automatically be converted to the correct currency in Google. Your store must support the appropriate shipping and tax rates for customers in each selected country.
              </p>
            </b-col>
          </b-form-row>
          <b-form-row class="align-items-center">
            <b-col
              cols="12"
              md="3"
              class="text-md-right"
            >
              <label class="mb-0">
                Products available in
              </label>
            </b-col>
            <b-col cols="12" md="9">


            </b-col>
          </b-form-row>
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
        </b-container>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: 'ProductFeedSettings',
  components: {
  },
  data() {
    return {
      selected: null,
      options: [
        { value: null, text: 'Please select an option' },
        { value: 'FR', text: 'France' },
        { value: 'BE', text: 'Belgium' },
      ],
    };
  },
};
</script>
