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
            :carrier="carrier"
            :validation-error="validationError"
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
          <span>{{ country }}</span>
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
            :carrier="carrier"
            :validation-error="validationError"
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
import {CustomCarrier} from '@/providers/shipping-rate-provider';

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
    carrier: {
      type: Object as PropType<CustomCarrier>,
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
  },
  methods: {
  },
});
</script>
