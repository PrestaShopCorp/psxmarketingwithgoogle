<template>
  <div>
    <h3
      class="ps_gs-fz-20 font-weight-600 mb-2"
    >
      {{ $t('productFeedSettings.shipping.shippingInformationTitle') }}
    </h3>
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
          :key="carrier.id_carrier"
          :carrier="carrier"
          :carriers-list="carriers"
          @toggleCarrier="updateCarriersArray"
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
      carriers: [
        {
          id_carrier: 3,
          name: 'GLS Chez vous +',
          delay: 'Vous êtes prévenus par mail et SMS de la date et du créneau horaire de livraison.',
          enabledCarrier: true,
        },
        {
          id_carrier: 4,
          name: 'GLS Service Point®',
          delay: 'Retrait en Point Relais® de votre choix. Vous êtes informé par E-mail ou SMS.',
          enabledCarrier: true,
        },
        {
          id_carrier: 5,
          name: 'Livraison demain avant 13h',
          delay: 'Colis livré le lendemain matin avant 13h à votre domicile.',
          enabledCarrier: true,
        },
        {
          id_carrier: 6,
          name: 'Livraison express',
          delay: 'Colis livré le lendemain avant 13 h dans le relais Pickup de votre choix.',
          enabledCarrier: true,
        },
      ],
    };
  },
  computed: {
    disableContinue() {
      return true;
    },
    shippingSettingsHeaderList() {
      return Object.values(ShippingSettingsHeaderType);
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
    updateCarriersArray(e) {
      this.carriers.forEach((carrier) => {
        if (carrier.id_carrier === e.id_carrier) {
          carrier.enabledCarrier = e.enabledCarrier;
        }
      });
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
