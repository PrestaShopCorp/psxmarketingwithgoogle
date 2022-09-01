<template>
  <div>
    <p class="h3 mr-2 mb-2 font-weight-600 d-inline-block">
      {{ $t('productFeedSettings.deliveryTimeAndRates.rateAndDelivery') }}
    </p>
    <p
      v-if="validationError"
      class="text-danger ps-gs_fz-14 d-inline-block"
    >
      {{ $t('productFeedSettings.deliveryTimeAndRates.estimateStep.error') }}
    </p>
    <b-card class="mb-2">
      <b-container>
        <b-row>
          <b-col>
            <div class="carrierName">
              <div class="mb-1">
                <span
                  class="font-weight-600"
                >
                  {{ $t('productFeedSettings.deliveryTimeAndRates.estimateStep.carrierName') }}
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
              <div class="mb-4">
                <b-form-input
                  type="text"
                  class="form-control"
                  style="max-width: 200px;"
                  id="carrierName"
                  v-model="carrier.carrierName"
                  :state="validateCarrierName"
                  placeholder="Description"
                  max="90"
                />
              </div>
            </div>

            <div class="offers">
              <div class="font-weight-600 mb-1">
                {{ $t('productFeedSettings.deliveryTimeAndRates.estimateStep.storeOffersTitle') }}
              </div>
              <div
                class="form-check"
                v-for="(offer, index) in offers"
                :key="index"
              >
                <b-form-radio
                  :state="validateRadio"
                  class="form-check-input"
                  name="offersChoice"
                  v-model="carrier.offerChosen"
                  :id="`${offer.text}${index}`"
                  :value="offer.value"
                >
                  <span style="color: black;">{{ offer.text }}</span>
                </b-form-radio>
              </div>
            </div>
          </b-col>
          <b-col>
            <b-row>
              <b-col>
                <div class="deliveryTime">
                  <div
                    class="font-weight-600 mb-1"
                  >
                    {{ $t('productFeedSettings.deliveryTimeAndRates.transitTimeHeader') }}
                  </div>
                  <p style="font-size:11px;">
                    {{ $t('productFeedSettings.deliveryTimeAndRates.deliveryInfo') }}
                  </p>
                </div>
              </b-col>
              <b-col>
                <div class="ps_gs-carrier__input-number-wrapper">
                  <b-form-input
                    type="number"
                    class="ps_gs-carrier__input-number no-arrows"
                    size="sm"
                    :state="validateTimeDelivery"
                    v-model.number="carrier.minDeliveryTime"
                    min="0"
                    :placeholder="$t('general.min')"
                  />
                  <b-input-group
                    :append="$t('general.days')"
                    class="ps_gs-carrier__input-number-group"
                  >
                    <b-form-input
                      type="number"
                      style="max-width: 50px;"
                      v-model.number="carrier.maxDeliveryTime"
                      class="ps_gs-carrier__input-number no-arrows"
                      size="sm"
                      :state="validateTimeDelivery"
                      :placeholder="$t('general.max')"
                    />
                  </b-input-group>
                </div>
              </b-col>
            </b-row>
            <!-- eslint-disable max-len -->
            <b-card
              class="offer-rates row"
              v-if="carrier.offerChosen === OfferType.FLAT_SHIPPING_RATE
                || carrier.offerChosen === OfferType.FREE_SHIPPING_OVER_AMOUNT"
            >
              <b-row v-if="carrier.offerChosen === OfferType.FLAT_SHIPPING_RATE">
                <b-col>
                  <div
                    class="font-weight-600 mb-1"
                  >
                    {{
                      $t('productFeedSettings.deliveryTimeAndRates.estimateStep.shippingRate.rate')
                    }}
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
                        v-model.number="carrier[carrier.offerChosen].shippingRateAmount"
                        :state="validateAmountRate(carrier[carrier.offerChosen].shippingRateAmount)"
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
                        v-model.number="carrier[carrier.offerChosen].shippingRateAmount"
                        :state="validateAmountRate(carrier[carrier.offerChosen].shippingRateAmount)"
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
                        :state="validateAmountRate(carrier[carrier.offerChosen].freeShippingAmount)"
                        v-model.number="carrier[carrier.offerChosen].freeShippingAmount"
                      />
                    </b-input-group>
                  </b-col>
                </b-row>
              </div>
            </b-card>
            <!-- eslint-enable max-len -->
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>
<script lang="ts">
import Vue, {PropType} from 'vue';
import {OfferType} from '@/enums/product-feed/offer';
import symbols from '@/assets/json/symbols.json';
import {validateDeliveryTime, CustomCarrier} from '@/providers/shipping-rate-provider';

export default Vue.extend({
  name: 'ProductFeedSettingsShipping',
  components: {
  },
  props: {
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
      OfferType,
      offers: [
        {
          text: this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.storeOffers.freeShippingRateForAllProducts'),
          value: OfferType.FLAT_SHIPPING_RATE,
        },
        {
          text: this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.storeOffers.freeShippingForAllProducts'),
          value: OfferType.FREE_SHIPPING,
        },
        {
          text: this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.storeOffers.freeShippingOverAmount'),
          value: OfferType.FREE_SHIPPING_OVER_AMOUNT,
        },
      ],
    };
  },
  computed: {
    validateTimeDelivery(): boolean|null {
      return validateDeliveryTime(this.carrier) ? null : false;
    },
    validateCarrierName(): boolean|null {
      if (!this.carrier.carrierName?.length) {
        return null;
      }
      if (this.carrier.carrierName.length <= 90
        && this.carrier.carrierName.length > 0
      ) {
        return true;
      }

      return false;
    },
    validateRadio(): boolean|null {
      return this.carrier.offerChosen ? null : false;
    },
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
  methods: {
    validateAmountRate(amount: number): boolean|null {
      return Number.isInteger(amount) && amount >= 0 ? null : false;
    },
  },
});
</script>
