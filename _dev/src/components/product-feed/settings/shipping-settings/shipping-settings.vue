<template>
  <div>

    <div class="d-flex mb-2 align-items-center">
      <h3
        class="ps_gs-fz-20 font-weight-600 mb-2"
        v-html="$t('productFeedSettings.shipping.shippingInformationTitle')"
      />
      <b-button
        variant="invisible"
        class="ml-1 p-0"
        v-b-tooltip:psxMktgWithGoogleApp
        :title="$t('productFeedSettings.shipping.shippingInformationTitleTooltip')"
      >
        <i class="material-icons text-secondary">
          info_outline
        </i>
      </b-button>
    </div>
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
          v-for="carrier in carriers"
          :key="carrier.carrierId"
          :carrier="carrier"
          :carriers-list="carriers"
          @updateCarrier="updateCarriersArray($event)"
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
      disableContinue: false,
    };
  },
  computed: {
    shippingSettingsHeaderList() {
      return Object.values(ShippingSettingsHeaderType);
    },
    carriers() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_SETTINGS'].shippingSettings;
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
    checkForContinue(carriers) {
      this.disableContinue = true;
      const checkConditionsToContinue = (arg) => {
        if (!arg.enabledCarrier) {
          return true;
        }
        return arg.maxHandlingTimeInDays && arg.maxTransitTimeInDays
            && arg.minHandlingTimeInDays && arg.minTransitTimeInDays
            && (arg.minHandlingTimeInDays < arg.maxHandlingTimeInDays)
            && (arg.minTransitTimeInDays < arg.maxTransitTimeInDays)
            && arg.deliveryType;
      };
      this.disableContinue = !carriers.every(checkConditionsToContinue);
    },
    updateCarriersArray(e) {
      this.carriers.forEach((carrier) => {
        if (carrier.carrierId === e.carrierId) {
          carrier[e.type] = e[e.type];
        }
      });
      this.checkForContinue(this.carriers);
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
