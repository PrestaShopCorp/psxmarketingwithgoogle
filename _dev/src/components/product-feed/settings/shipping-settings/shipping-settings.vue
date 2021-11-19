<template>
  <div>
    <h3
      class="ps_gs-fz-20 font-weight-600 mb-2"
      v-html="$t('productFeedSettings.shipping.shippingInformationTitle')"
    />
    <div class="d-flex  align-items-center pr-3">
      <p>
        {{ $t('productFeedSettings.shipping.shippingInformationIntro') }}
      </p>
      <b-dropdown
        v-if="countriesFromCarriers"
        id="filterByCountryDropdown"
        variant=" "
        menu-class="ps-dropdown"
        :text="this.$options.filters.changeCountriesCodesToNames(countryFilter)[0]
          || $t('productFeedSettings.shipping.filterTitle')"
        class="mb-2 ps-dropdown psxmarketingwithgoogle-dropdown bordered maxw-sm-250"
      >
        <b-dropdown-item
          v-for="(country, index) in countriesFromCarriers"
          :key="index"
          @click="filterByCountryName(country)"
          :value="country"
          variant="dark"
          link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
        >
          {{ country }}
        </b-dropdown-item>
      </b-dropdown>
    </div>

    <!-- START > TABLE -->
    <b-table-simple
      id="table-carriers"
      class="mb-3 ps_gs-table-carriers"
      variant="light"
      responsive="xl"
      :table-class="{'border-bottom-0': !carriers.length}"
    >
      <b-thead>
        <b-tr>
          <b-th
            v-for="type in shippingSettingsHeaderList"
            :key="type"
            class="font-weight-600"
          >
            <div
              v-if="hasHeader(type)"
              class="flex align-items-center text-nowrap"
            >
              <span>
                {{ $t(`productFeedSettings.shipping.${type}Header`) }}
              </span>
              <b-button
                v-if="hasToolTip(type)"
                variant="invisible"
                v-b-tooltip:psxMktgWithGoogleApp
                :title="$t(`productFeedSettings.shipping.${type}Tooltip`)"
                class="p-0 mt-0 ml-1 border-0 d-inline-flex align-items-center"
              >
                <i class="material-icons ps_gs-fz-14 text-secondary">info_outlined</i>
              </b-button>
            </div>
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody
        class="bg-white"
      >
        <b-tr
          v-if="!carriers.length"
          data-test-id="no-carriers"
        >
          <b-td
            class="text-center py-5"
            :colspan="shippingSettingsHeaderList.length"
          >
            <h4
              class="font-weight-normal mb-1 mt-5"
            >
              {{ $t('productFeedSettings.shipping.noCarriersTitle') }}
            </h4>
            <p class="text-secondary mb-1">
              {{ $t('productFeedSettings.shipping.noCarriersDescription') }}
            </p>
            <b-button
              variant="outline-secondary"
              :href="$store.getters['app/GET_CARRIERS_URL']"
              class="mb-5"
              target="_blank"
              size="sm"
            >
              {{ $t('cta.noCarriers') }}
            </b-button>
          </b-td>
        </b-tr>
        <table-row-carrier
          v-else
          v-for="(carrier, index) in carriers"
          :key="index"
          :carrier="carrier"
          :carriers-list="carriers"
        />
      </b-tbody>
    </b-table-simple>
    <!-- END > TABLE -->
    <p class="text-muted">
      <i class="material-icons-round ps_gs-fz-14 d-inline-block align-middle mr-2">warning_amber</i>
      <span class="ps_gs-fz-12 align-middle">
        {{ $t('productFeedSettings.shipping.shippingTableNotice') }}
      </span>
    </p>
    <div
      class="text-primary"
    >
      <a
        class="ps_gs-fz-12 mb-0 text-primary"
        :href="$store.getters['app/GET_CARRIERS_URL']"
        target="_blank"
      >
        {{ $t('productFeedSettings.shipping.addNewCarriers') }}
      </a>
      <span class="ps_gs-fz-12 text-dark">
        |
      </span>
      <b-button
        variant="link"
        class="ps_gs-fz-12 font-weight-normal p-0 border-0
        text-decoration-underline text-wrap text-left"
        @click="refreshComponent"
      >
        {{ $t('productFeedSettings.shipping.refreshCarriers') }}
        <i class="material-icons ps_gs-fz-12">refresh</i>
      </b-button>
    </div>
    <actions-buttons
      :next-step="nextStep"
      :previous-step="previousStep"
      :disable-continue="disableContinue"
      @cancelProductFeedSettingsConfiguration="cancel()"
    />
    <settings-footer />
  </div>
</template>

<script>
import ShippingSettingsHeaderType from '@/enums/product-feed/shipping-settings-header-type.ts';
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import TableRowCarrier from './table-row-carrier.vue';
import {validateDeliveryDetail} from '@/providers/shipping-settings-provider';

export default {
  components: {
    SettingsFooter,
    TableRowCarrier,
    ActionsButtons,
  },
  data() {
    return {
      countries: this.$store.getters['app/GET_ACTIVE_COUNTRIES'],
      countryFilter: [],
    };
  },
  computed: {
    shippingSettingsHeaderList() {
      return Object.values(ShippingSettingsHeaderType);
    },
    carriers() {
      if (this.countryFilter.length) {
        return this.$store.state.productFeed.settings.deliveryDetails
          .filter((carrier) => carrier.country === this.countryFilter[0]);
      }
      return this.$store.state.productFeed.settings.deliveryDetails;
    },

    countriesFromCarriers() {
      return this.$options.filters.changeCountriesCodesToNames(
        this.$store.state.productFeed.settings.deliveryDetails.map((e) => e.country).sort()
          .filter((item, pos, ary) => !pos || item !== ary[pos - 1]),
      );
    },
    disableContinue() {
      return !this.carriers.every(validateDeliveryDetail);
    },
  },
  methods: {
    hasToolTip(headerType) {
      if (
        headerType === ShippingSettingsHeaderType.SHIP_TO_CUSTOMER
        || headerType === ShippingSettingsHeaderType.HANDLING_TIME
        || headerType === ShippingSettingsHeaderType.TRANSIT_TIME
      ) {
        return true;
      }
      return false;
    },
    hasHeader(headerType) {
      if (
        headerType === ShippingSettingsHeaderType.ENABLE
        || headerType === ShippingSettingsHeaderType.ACTION
      ) {
        return false;
      }
      return true;
    },
    previousStep() {
      localStorage.setItem('productFeed-deliveryDetails', JSON.stringify(this.carriers));
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 1);
      window.scrollTo(0, 0);
    },
    nextStep() {
      localStorage.setItem('productFeed-deliveryDetails', JSON.stringify(this.carriers));
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 3);
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    refreshComponent() {
      this.$store.dispatch('productFeed/GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS');
    },
    filterByCountryName(country) {
      const codeCountry = this.$options.filters.changeCountriesNamesToCodes([country]);
      this.countryFilter = codeCountry;
    },
  },
};
</script>
