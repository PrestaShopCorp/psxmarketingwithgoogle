<template>
  <div id="customCarrierForm">
    <p class="h3 mr-2 mb-2 font-weight-600 d-inline-block">
      {{ $t('productFeedSettings.deliveryTimeAndRates.rateAndDelivery') }}
    </p>
    <p
      v-if="validateCarrier === false"
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
                  class="p-0 ml-1 align-text-top"
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
                  class="form-control ps_gs-mw-200"
                  id="carrierName"
                  v-model="customCarrier.carrierName"
                  @input="$emit('dataUpdated', customCarrier)"
                  :state="validateCarrierName"
                  :placeholder="$t('productFeedSettings.attributeMapping.description')"
                  maxlength="90"
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
                  v-model="customCarrier.offer"
                  @input="$emit('dataUpdated', customCarrier)"
                  :id="`${offer.text}${index}`"
                  :value="offer.value"
                >
                  <span class="text-black">{{ offer.text }}</span>
                </b-form-radio>
              </div>
            </div>
          </b-col>
          <b-col>
            <b-row class="mb-4">
              <b-col>
                <div class="deliveryTime">
                  <div
                    class="font-weight-600 mb-1"
                  >
                    {{ $t('productFeedSettings.deliveryTimeAndRates.transitTimeHeader') }}
                  </div>
                  <p class="ps_gs-fz-10">
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
                    v-model.number="customCarrier.minDeliveryTime"
                    @input="$emit('dataUpdated', customCarrier)"
                    min="0"
                    :placeholder="$t('general.min')"
                  />
                  <b-input-group
                    :append="$t('general.days')"
                    class="ps_gs-carrier__input-number-group flex-nowrap"
                  >
                    <b-form-input
                      type="number"
                      v-model.number="customCarrier.maxDeliveryTime"
                      @input="$emit('dataUpdated', customCarrier)"
                      class="ps_gs-carrier__input-number no-arrows min-input-custom"
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
              v-if="customCarrier.offer === OfferType.FLAT_SHIPPING_RATE
                || customCarrier.offer === OfferType.FREE_SHIPPING_OVER_AMOUNT"
            >
              <b-row v-if="customCarrier.offer === OfferType.FLAT_SHIPPING_RATE">
                <b-col>
                  <div
                    class="font-weight-600 mb-1"
                  >
                    {{
                      $t('productFeedSettings.deliveryTimeAndRates.estimateStep.shippingRate.rate')
                    }}
                  </div>
                  <p class="ps_gs-fz-10">
                    {{
                      $t('productFeedSettings.deliveryTimeAndRates.estimateStep.shippingRate.rateDesc')
                    }}
                  </p>
                </b-col>
                <b-col>
                  <div>
                    <b-input-group
                      :append="getSymbol"
                      class="ps_gs-carrier__input-number-group"
                    >
                      <b-form-input
                        type="number"
                        class="ps_gs-carrier__input-number no-arrows"
                        size="sm"
                        step="0.01"
                        placeholder="5.99"
                        v-model.number="customCarrier[customCarrier.offer].shippingCost"
                        @input="$emit('dataUpdated', customCarrier)"
                        :state="validateAmountRate(customCarrier[customCarrier.offer].shippingCost)"
                      />
                    </b-input-group>
                  </div>
                </b-col>
              </b-row>
              <div v-else>
                <b-row class="freeShippingOverAmount">
                  <b-col class="align-self-center">
                    <div class="mb-1 w-75">
                      <span
                        class="font-weight-600"
                      >
                        {{
                          $t('productFeedSettings.deliveryTimeAndRates.estimateStep.shippingRate.overAmount')
                        }}
                      </span>
                      <b-button
                        class="p-0 ml-1 align-text-top"
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
                      :append="getSymbol"
                      class="ps_gs-carrier__input-number-group"
                    >
                      <b-form-input
                        type="number"
                        class="ps_gs-carrier__input-number no-arrows ps_gs-mw-90"
                        size="sm"
                        step="0.01"
                        placeholder="42.99"
                        v-model.number="customCarrier[customCarrier.offer].orderPrice"
                        @input="$emit('dataUpdated', customCarrier)"
                        :state="validateAmountRate(customCarrier[customCarrier.offer].orderPrice)"
                      />
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="freeShippingOverAmount">
                  <b-col class="align-self-center">
                    <div class="mb-1">
                      <span
                        class="font-weight-600"
                      >
                        {{ $t('productFeedSettings.deliveryTimeAndRates.estimateStep.shippingRate.rate') }}
                      </span>
                      <b-button
                        class="p-0 ml-1 align-text-top"
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
                      :append="getSymbol"
                      class="ps_gs-carrier__input-number-group"
                    >
                      <b-form-input
                        type="number"
                        class="ps_gs-carrier__input-number no-arrows ps_gs-mw-90"
                        size="sm"
                        step="0.01"
                        placeholder="5.99"
                        :state="validateAmountRate(customCarrier[customCarrier.offer].shippingCost)"
                        v-model.number="customCarrier[customCarrier.offer].shippingCost"
                        @input="$emit('dataUpdated', customCarrier)"
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
import {
  validateDeliveryTime,
  CustomCarrier,
  validateOfferChoice,
  validateCarrierName,
  validateCarrier,
} from '@/providers/shipping-rate-provider';

export default Vue.extend({
  name: 'CustomCarrierForm',
  components: {
  },
  props: {
    customCarrier: {
      type: Object as PropType<CustomCarrier>,
      required: true,
    },
    displayValidationErrors: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      OfferType,
      offers: [
        {
          text: this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.storeOffers.flatShippingRateForAllProducts'),
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
    validateCarrier(): boolean|null {
      if (!this.displayValidationErrors) {
        return null;
      }
      return validateCarrier(this.customCarrier);
    },
    validateTimeDelivery(): boolean|null {
      if (!this.displayValidationErrors) {
        return null;
      }
      return validateDeliveryTime(this.customCarrier) ? null : false;
    },
    validateCarrierName(): boolean|null {
      if (!this.displayValidationErrors) {
        return null;
      }
      return validateCarrierName(this.customCarrier);
    },
    validateRadio(): boolean|null {
      if (!this.displayValidationErrors) {
        return null;
      }
      if (this.customCarrier.offer) {
        return null;
      }

      return validateOfferChoice(this.customCarrier.offer);
    },
    getSymbol() {
      return this.$store.getters['app/GET_SYMBOL_OF_CURRENT_CURRENCY'];
    },
  },
  methods: {
    validateAmountRate(amount: number|null): boolean|null {
      if (!this.displayValidationErrors) {
        return null;
      }
      if (amount === null) {
        return false;
      }
      return !Number.isNaN(amount) && amount > 0 ? null : false;
    },
  },
});
</script>
