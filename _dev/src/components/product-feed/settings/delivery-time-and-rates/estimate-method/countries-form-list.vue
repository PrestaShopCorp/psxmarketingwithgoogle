<template>
  <!-- CASE FOR RATE_FOR_ALL_COUNTRIES -->
  <div>
    <b-card
      no-body
      class="mb-1"
      v-if="rateChosen === RateType.RATE_ALL_COUNTRIES"
    >
      <b-card-header
        header-tag="header"
        class="p-1"
        role="tab"
      >
        <b-button
          block
          v-b-toggle.withAllCountries
          class="d-flex btn-without-hover"
          variant="invisible"
        >
          <span>
            {{
              countriesNames.length > 1 ?
                countriesNames.toString() : countriesNames[0]
            }}
          </span>
          <i
            aria-hidden="true"
            class="material-icons ps_gs-fz-20 ml-auto when-open"
          >
            expand_more
          </i>
          <i
            aria-hidden="true"
            class="material-icons ps_gs-fz-20 ml-auto when-closed"
          >chevron_left</i>
        </b-button>
      </b-card-header>
      <b-collapse
        id="withAllCountries"
        accordion="customCarrierAccordion"
        role="tabpanel"
      >
        <b-card-body>
          <custom-carrier-form
            :custom-carrier="carriers[0]"
            :display-validation-errors="validationError"
            @dataUpdated="$emit('dataUpdated', carriers[0])"
          />
        </b-card-body>
      </b-collapse>
    </b-card>

    <!-- CASE FOR RATE_PER_COUNTRY -->
    <b-card
      no-body
      class="mb-1"
      v-else-if="rateChosen === RateType.RATE_PER_COUNTRY"
      v-for="(country, index) in countriesNames"
      :key="index"
    >
      <b-card-header
        header-tag="header"
        class="p-1"
        role="tab"
      >
        <b-button
          block
          v-b-toggle="`withAllCountries-${index}`"
          class="d-flex btn-without-hover"
          variant="invisible"
        >
          <span>{{ carrier.country }}</span>
          <i
            aria-hidden="true"
            class="material-icons ps_gs-fz-20 ml-auto when-closed"
          >
            expand_more
          </i>
          <i
            aria-hidden="true"
            class="material-icons ps_gs-fz-20 ml-auto when-open"
          >chevron_left</i>
        </b-button>
      </b-card-header>
      <b-collapse
        visible
        :id="`withAllCountries-${index}`"
        :accordion="`customCarrierAccordion${index}`"
        role="tabpanel"
      >
        <b-card-body>
          <custom-carrier-form
            :custom-carrier="carrier"
            :display-validation-errors="validationError"
            @dataUpdated="$emit('dataUpdated', carriers)"
          />
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>
<script lang="ts">
import Vue, {PropType} from 'vue';
import CustomCarrierForm from './custom-carrier-form.vue';
import {RateType} from '@/enums/product-feed/rate';
// import {CustomCarrier} from '@/providers/shipping-rate-provider';
import {OfferType} from '@/enums/product-feed/offer';

export default Vue.extend({
  name: 'CountriesFormList',
  components: {
    CustomCarrierForm,
  },
  props: {
    rateChosen: {
      type: String as PropType<RateType>,
      required: true,
    },
    countries: {
      type: Array,
      required: true,
    },
    validationError: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      RateType,
    };
  },
  computed: {
    countriesNames(): string[] {
      return this.$options.filters.changeCountriesCodesToNames(this.countries);
    },
    carriers() {
      const carriers = [];

      if (this.rateChosen === RateType.CUSTOM_RATE) {
        for (let i = 0; i < this.countries.length; i += 1) {
          const obj = {
            country: this.countries[i],
            carrierName: '',
            offerChosen: null,
            isValid: true,
            maxDeliveryTime: 0,
            minDeliveryTime: 0,
            [OfferType.FREE_SHIPPING_OVER_AMOUNT]: {
              shippingRateAmount: 0,
              freeShippingAmount: 0,
            },
            [OfferType.FLAT_SHIPPING_RATE]: {
              shippingRateAmount: 0,
            },
          };
          carriers.push(obj);
        }

        return carriers;
      }

      carriers.push({
        country: this.countries[0],
        carrierName: '',
        isValid: true,
        offerChosen: null,
        maxDeliveryTime: 0,
        minDeliveryTime: 0,
        [OfferType.FREE_SHIPPING_OVER_AMOUNT]: {
          shippingRateAmount: 0,
          freeShippingAmount: 0,
        },
        [OfferType.FLAT_SHIPPING_RATE]: {
          shippingRateAmount: 0,
        },
      });
      return carriers;
    },
  },
  methods: {
  },
});
</script>
