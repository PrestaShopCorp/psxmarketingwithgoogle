<template>
  <div>
    <h3
      class="ps_gs-fz-20 font-weight-600 mb-2"
      v-html="$t('productFeedSettings.shipping.shippingInformationTitle')"
    />
    <p>
      {{ $t('productFeedSettings.shipping.shippingInformationIntro') }}
    </p>
    <!-- START > TABLE -->
    <b-table-simple
      id="table-carriers"
      class="mb-3 ps_gs-table-carriers"
      variant="light"
      responsive="xl"
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
        <table-row-carrier
          v-for="(carrier, index) in carriers"
          :key="index"
          :carrier="carrier"
          :carriers-list="carriers"
        />
      </b-tbody>
    </b-table-simple>
    <!-- END > TABLE -->
    <div
      class="d-flex align-items-center justify-content-end"
    >
      <i class="material-icons-round ps_gs-fz-14 text-secondary mr-2">warning_amber</i>
      <VueShowdown
        class="ps_gs-fz-12 mb-0 text-secondary"
        tag="p"
        :markdown="$t('productFeedSettings.shipping.shippingTableNotice',
                      ['index.php?controller=AdminCarriers'])"
        :extensions="['extended-link', 'no-p-tag']"
      />
    </div>
    <div class="d-md-flex text-center justify-content-end mt-3">
      <b-button
        @click="cancel"
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <b-button
        data-test-id="continueButton"
        @click="nextStep"
        size="sm"
        :disabled="disableContinue"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t('cta.continue') }}
      </b-button>
    </div>
    <settings-footer />
  </div>
</template>

<script>
import ShippingSettingsHeaderType from '@/enums/product-feed/shipping-settings-header-type.ts';
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import TableRowCarrier from './table-row-carrier.vue';

export default {
  components: {
    SettingsFooter,
    TableRowCarrier,
  },

  data() {
    return {
      updatedKey: 0,
      countries: this.$store.getters['app/GET_ACTIVE_COUNTRIES'],
    };
  },
  computed: {
    shippingSettingsHeaderList() {
      return Object.values(ShippingSettingsHeaderType);
    },
    carriers() {
      return this.$store.state.productFeed.settings.deliveryDetails
        .filter((carrier) => this.countries.includes(carrier.country));
    },
    disableContinue() {
      return !this.carriers.every(this.validateCarrier);
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
    validateCarrier(carrier) {
      if (!carrier.enabledCarrier) {
        return true;
      }
      // /!\ duplicated code validating specific parts of carrier in table-row-carrier.vue
      return carrier.enabledCarrier && carrier.maxHandlingTimeInDays && carrier.maxTransitTimeInDays
          && carrier.minHandlingTimeInDays && carrier.minTransitTimeInDays
          && (Number(carrier.minHandlingTimeInDays) < Number(carrier.maxHandlingTimeInDays))
          && (Number(carrier.minTransitTimeInDays) < Number(carrier.maxTransitTimeInDays))
          && Number(carrier.minHandlingTimeInDays) >= 0
          && Number(carrier.maxHandlingTimeInDays) >= 0
          && Number(carrier.minTransitTimeInDays) >= 0
          && Number(carrier.maxTransitTimeInDays) >= 0
          && carrier.deliveryType;
    },

    nextStep() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 3);
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
};
</script>
