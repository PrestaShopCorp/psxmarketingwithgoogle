<template>
  <div>
    <h3
      class="title-size-h3 font-weight-600 mb-2"
      v-html="$t('productFeedSettings.steps.deliveryTimesAndRates')"
    />
    <div class="d-flex  align-items-center pr-3">
      <p>
        {{ $t('productFeedSettings.deliveryTimeAndRates.shippingInformationIntro') }}
      </p>
      <b-dropdown
        :disabled="countries.length < 2"
        id="filterByCountryDropdown"
        variant=" "
        menu-class="ps-dropdown"
        :text="countryChosen ? $options.filters.changeCountriesCodesToNames([countryChosen])[0]
          : $t('productFeedSettings.deliveryTimeAndRates.filterTitle')"
        class="mb-2 ps-dropdown psxmarketingwithgoogle-dropdown bordered maxw-sm-250 ml-2"
      >
        <b-dropdown-item
          :disabled="!countryChosen"
          variant="dark"
          link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
          @click="countryChosen = null"
        >
          {{ $t('productFeedSettings.deliveryTimeAndRates.filterTitle') }}
        </b-dropdown-item>
        <b-dropdown-item
          :disabled="country === countryChosen"
          v-for="(country, index) in countries"
          :key="index"
          @click="countryChosen = country"
          variant="dark"
          link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
        >
          {{ $options.filters.changeCountriesCodesToNames([country])[0] }}
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
            <component
              :is="hasToolTip(type) ? 'b-button' : 'div'"
              class="d-flex align-items-start text-wrap"
              :class="hasToolTip(type) && 'p-0 text-left'"
              :variant="hasToolTip(type) && 'text'"
              v-b-tooltip:psxMktgWithGoogleApp="{disabled: !hasToolTip(type)}"
              :title="hasToolTip(type)
                && $t(`productFeedSettings.deliveryTimeAndRates.${type}Tooltip`)"
              v-if="hasHeader(type)"
            >
              <VueShowdown
                tag="span"
                class="text-wrap"
                :markdown="$t(`productFeedSettings.deliveryTimeAndRates.${type}Header`)"
                :extensions="['no-p-tag']"
              />
              <span
                v-if="hasToolTip(type)"
                variant="invisible"
                class="pt-1 ml-1 mr-n1 border-0 d-inline-flex align-items-center"
              >
                <i class="material-icons ps_gs-fz-14 text-secondary">help_outline</i>
              </span>
            </component>
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody
        class="bg-white"
      >
        <b-tr
          v-if="!countries.length"
          data-test-id="no-carriers"
        >
          <b-td
            class="text-center py-5"
            :colspan="shippingSettingsHeaderList.length"
          >
            <h4
              class="font-weight-normal mb-1 mt-5"
            >
              {{ $t('productFeedSettings.deliveryTimeAndRates.countryNeededTitle') }}
            </h4>
            <p class="text-secondary mb-1">
              {{ $t('productFeedSettings.deliveryTimeAndRates.countryNeededDescription') }}
            </p>
          </b-td>
        </b-tr>
        <table-row-carrier
          v-else
          v-for="(carrier, index) in visibleCarriers"
          :key="index"
          :carrier="carrier"
          :carriers-list="carriers"
          :display-validation-errors="displayValidationErrors"
          @carrierUpdated="carrierUpdated($event, index)"
        />
      </b-tbody>
    </b-table-simple>
    <!-- END > TABLE -->
    <p class="text-muted text-center">
      <span class="ps_gs-fz-12 align-middle">
        {{ $t('productFeedSettings.deliveryTimeAndRates.shippingTableNotice') }}
      </span>
    </p>
    <div
      class="text-primary text-center pb-3"
    >
      <a
        class="ps_gs-fz-12 mb-0"
        :href="$store.getters['app/GET_CARRIERS_URL']"
        target="_blank"
      >
        {{ $t('productFeedSettings.deliveryTimeAndRates.addNewCarriers') }}
      </a>
      <span class="ps_gs-fz-12 text-dark">
        |
      </span>
      <b-button
        variant="link"
        class="ps_gs-fz-12 font-weight-normal p-0 border-0
        text-decoration-underline text-wrap text-left"
        @click="$emit('refresh')"
      >
        {{ $t('productFeedSettings.deliveryTimeAndRates.refreshCarriers') }}
        <i class="material-icons ps_gs-fz-12">refresh</i>
      </b-button>
      <span class="ps_gs-fz-12 text-dark">
        |
      </span>
      <b-button
        variant="link"
        class="ps_gs-fz-12 font-weight-normal p-0 border-0
        text-decoration-underline text-wrap text-left"
        @click="switchToFlatRate"
      >
        {{ $t('productFeedSettings.deliveryTimeAndRates.switchToFlatRate') }}
        <i class="material-icons ps_gs-fz-12">call_missed_outgoing</i>
      </b-button>
    </div>

    <!-- Errors -->
    <p
      v-if="!enabledCarriers.length && displayValidationErrors"
      class="text-danger text-small ps_gs-fz-12 d-md-flex justify-content-end"
    >
      <!-- eslint-disable-next-line max-len -->
      {{ $t('productFeedSettings.deliveryTimeAndRates.importOption.validationErrors.needAtLeastOneCarrier') }}
    </p>
    <p
      v-else-if="!targetCountriesAllHaveOneCarrier && displayValidationErrors"
      class="text-danger text-small ps_gs-fz-12 d-md-flex justify-content-end"
    >
      <!-- eslint-disable-next-line max-len -->
      {{ $t('productFeedSettings.deliveryTimeAndRates.importOption.validationErrors.needAtLeastOneCarrierForEachCountry') }}
    </p>
  </div>
</template>

<script lang="ts">
import {PropType} from 'vue';
import ShippingSettingsHeaderType from '@/enums/product-feed/shipping-settings-header-type';
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import TableRowCarrier from './table-row-carrier.vue';
import {DeliveryDetail, validateEachCountryHasAtLeastOneCarrier} from '../../../../../providers/shipping-settings-provider';
import {ShippingSetupOption} from '../../../../../enums/product-feed/shipping';

export default {
  components: {
    SettingsFooter,
    TableRowCarrier,
    ActionsButtons,
  },
  props: {
    // Countries iso codes
    countries: {
      type: Array as PropType<string[]>,
      required: true,
    },
    carriers: {
      type: Array as PropType<DeliveryDetail[]>,
      required: true,
    },
    displayValidationErrors: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      countryChosen: null,
    };
  },
  computed: {
    shippingSettingsHeaderList() {
      return Object.values(ShippingSettingsHeaderType);
    },
    visibleCarriers() {
      if (!this.countryChosen) {
        return this.carriers;
      }
      return this.carriers
        .filter((carrier) => this.countryChosen === carrier.country);
    },
    enabledCarriers() {
      return this.carriers.filter(
        (e: DeliveryDetail) => e.enabledCarrier,
      );
    },
    targetCountriesAllHaveOneCarrier() {
      return validateEachCountryHasAtLeastOneCarrier(
        this.countries,
        this.enabledCarriers,
      );
    },
  },
  methods: {
    hasToolTip(headerType) {
      if (
        headerType === ShippingSettingsHeaderType.SHIP_TO_CUSTOMER
        || headerType === ShippingSettingsHeaderType.TRANSIT_TIME
      ) {
        return true;
      }
      return false;
    },
    hasHeader(headerType) {
      if (
        headerType === ShippingSettingsHeaderType.ACTION
      ) {
        return false;
      }
      return true;
    },
    switchToFlatRate() {
      this.$store.commit('productFeed/SET_SHIPPING_SETUP_SELECTED', ShippingSetupOption.ESTIMATE);
    },
    carrierUpdated(carrierData: DeliveryDetail, index: number): void {
      this.$emit(
        'dataUpdated',
        this.carriers.toSpliced(index, 1, {
          ...carrierData[index],
          ...carrierData,
        }),
      );
    },
  },
  watch: {
    carriers: {
      handler(carriers) {
        this.$emit('dataUpdated', carriers);
      },
      immediate: true,
    },
  },
};
</script>
