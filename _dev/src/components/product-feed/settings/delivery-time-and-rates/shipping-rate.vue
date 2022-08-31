<template>
  <b-card
    class="offer-rates row"
    v-if="offerChosen === OfferType.FLAT_SHIPPING_RATE
      || offerChosen === OfferType.FREE_SHIPPING_OVER_AMOUNT"
  >
    <b-row v-if="offerChosen === OfferType.FLAT_SHIPPING_RATE">
      <b-col>
        <div
          class="font-weight-600 mb-1"
        >
          {{ $t('productFeedSettings.deliveryTimeAndRates.estimateStep.shippingRate.rate') }}
        </div>
        <p style="font-size:11px;">
          {{
            $t('productFeedSettings.deliveryTimeAndRates.estimateStep.shippingRate.rateDesc')
          }}
        </p>
      </b-col>
      <b-col>
        <div>
          <b-input-group
            :append="budgetCurrencySymbol"
            class="ps_gs-carrier__input-number-group"
          >
            <b-form-input
              type="number"
              class="ps_gs-carrier__input-number no-arrows"
              size="sm"
              v-model.number="flateRate.shippingRateAmount"
              :state="validateAmountRate(flateRate.shippingRateAmount)"
            />
          </b-input-group>
        </div>
      </b-col>
    </b-row>
    <div v-else>
      <b-row>
        <b-col class="align-self-center">
          <div class="mb-1">
            <span
              class="font-weight-600"
            >
              {{
                $t('productFeedSettings.deliveryTimeAndRates.estimateStep.shippingRate.overAmount')
              }}
            </span>
            <b-button
              class="p-0 ml-1"
              variant="text"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="''"
            >
              <span class="material-icons-round text-primary mb-0 ps_gs-fz-16 w-16">
                info_outlined
              </span>
            </b-button>
          </div>
        </b-col>
        <b-col class="col-auto mb-2">
          <b-input-group
            :append="budgetCurrencySymbol"
            class="ps_gs-carrier__input-number-group"
          >
            <b-form-input
              style="max-width: 90px;"
              type="number"
              class="ps_gs-carrier__input-number no-arrows"
              size="sm"
              v-model.number="shippingOver.shippingRateAmount"
              :state="validateAmountRate(shippingOver.shippingRateAmount)"
            />
          </b-input-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="align-self-center">
          <div class="mb-1">
            <span
              class="font-weight-600"
            >
              {{ $t('productFeedSettings.deliveryTimeAndRates.estimateStep.shippingRate.rate') }}
            </span>
            <b-button
              class="p-0 ml-1"
              variant="text"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="''"
            >
              <span class="material-icons-round text-primary mb-0 ps_gs-fz-16 w-16">
                info_outlined
              </span>
            </b-button>
          </div>
        </b-col>
        <b-col class="col-auto">
          <b-input-group
            :append="budgetCurrencySymbol"
            class="ps_gs-carrier__input-number-group"
          >
            <b-form-input
              style="max-width: 90px;"
              type="number"
              class="ps_gs-carrier__input-number no-arrows"
              size="sm"
              :state="validateAmountRate(shippingOver.freeShippingOverAmount)"
              v-model.number="shippingOver.freeShippingOverAmount"
            />
          </b-input-group>
        </b-col>
      </b-row>
    </div>
  </b-card>
</template>
<script lang="ts">
import Vue, {PropType} from 'vue';
import symbols from '@/assets/json/symbols.json';
import {OfferType} from '@/enums/product-feed/offer';

export default Vue.extend({
  name: 'ShippingRate',
  components: {
  },
  data() {
    return {
      OfferType,
      shippingOver: {
        shippingRateAmount: 0,
        freeShippingOverAmount: 0,
      },
      flateRate: {
        shippingRateAmount: 0,
      },
    };
  },
  props: {
    offerChosen: {
      type: String as PropType<OfferType>,
      required: true,
    },
  },
  methods: {
    validateAmountRate(amount: number): boolean|null {
      return Number.isInteger(amount) && amount >= 0 ? null : false;
    },
  },
  computed: {
    budgetCurrencySymbol() {
      const currentCurrency = this.$store.getters['app/GET_CURRENT_CURRENCY'];
      const countrySelected = this.$store.getters['productFeed/GET_TARGET_COUNTRIES'];
      try {
        const displayAmount = 0;
        const country = countrySelected[0];
        const currencyFormatted = displayAmount.toLocaleString(country, {
          style: 'currency',
          currency: currentCurrency,
        });

        return currencyFormatted.replace(/[ .,0]*/, '');
      } catch (error) {
        const currency = symbols.find((c) => c.currency === currentCurrency);

        return currency ? currency.symbol : '';
      }
    },
  },
});
</script>
