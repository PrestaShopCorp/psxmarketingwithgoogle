<template>
  <div class="customCarrierForm">
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
              :title="$t('productFeedSettings.deliveryTimeAndRates.tooltips.carrierName')"
            >
              <span class="material-icons-round text-secondary mb-0 ps_gs-fz-16 w-16">
                help_outline
              </span>
            </b-button>
          </div>
          <div class="mb-4">
            <b-form-input
              type="text"
              class="form-control ps_gs-mw-200"
              id="carrierName"
              v-model="localCarrier.carrierName"
              @input="onDataUpdate"
              :state="validateCarrierName"
              :placeholder="
                $t(
                  'productFeedSettings.deliveryTimeAndRates.estimateStep.estimateInputLabel'
                )
              "
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
              :name="`offersChoice-${localCarrier.countries[0]}`"
              v-model="localCarrier.offer"
              @input="onDataUpdate"
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
          <b-col class="ml-3">
            <div class="ps_gs-carrier__input-number-wrapper">
              <b-form-input
                type="number"
                class="ps_gs-carrier__input-number no-arrows"
                size="sm"
                :state="validateTimeDelivery"
                v-model.number="localCarrier.minDeliveryTime"
                @input="onDataUpdate"
                min="0"
                :placeholder="$t('general.min')"
              />
              <b-input-group
                :append="$t('general.days')"
                class="ps_gs-carrier__input-number-group flex-nowrap"
              >
                <b-form-input
                  type="number"
                  v-model.number="localCarrier.maxDeliveryTime"
                  @input="onDataUpdate"
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
          class="offer-rates bg-off-white"
          v-if="localCarrier.offer === OfferType.FLAT_SHIPPING_RATE
            || localCarrier.offer === OfferType.FREE_SHIPPING_OVER_AMOUNT"
        >
          <b-row v-if="localCarrier.offer === OfferType.FLAT_SHIPPING_RATE">
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
                  :append="currencies.length <= 1 ? localCarrier.currency : undefined"
                  class="ps_gs-carrier__input-number-group"
                >
                  <b-form-input
                    type="number"
                    class="ps_gs-carrier__input-number no-arrows"
                    size="sm"
                    step="0.01"
                    placeholder="5.99"
                    v-model.number="localCarrier[localCarrier.offer].shippingCost"
                    @input="onDataUpdate"
                    :state="validateAmountRate(localCarrier[localCarrier.offer].shippingCost)"
                  />
                  <slot
                    name="append"
                    v-if="currencies.length > 1"
                  >
                    <currency-dropdown
                      :currencies="currencies"
                      :selected-currency="localCarrier.currency"
                      @update:selectedCurrency="newValue => localCarrier.currency = newValue"
                    />
                  </slot>
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
                    :title="$t('productFeedSettings.deliveryTimeAndRates.tooltips.freeShippingOverAmount')"
                  >
                    <span class="material-icons-round text-secondary mb-0 ps_gs-fz-16 w-16">
                      help_outline
                    </span>
                  </b-button>
                </div>
              </b-col>
              <b-col class="col-auto mb-2">
                <b-input-group
                  :append="currencies.length <= 1 ? localCarrier.currency : undefined"
                  class="ps_gs-carrier__input-number-group"
                >
                  <b-form-input
                    type="number"
                    class="ps_gs-carrier__input-number no-arrows ps_gs-mw-90"
                    size="sm"
                    step="0.01"
                    placeholder="42.99"
                    v-model.number="localCarrier[localCarrier.offer].orderPrice"
                    @input="onDataUpdate"
                    :state="validateAmountRate(localCarrier[localCarrier.offer].orderPrice)"
                  />
                  <slot
                    name="append"
                    v-if="currencies.length > 1"
                  >
                    <currency-dropdown
                      :currencies="currencies"
                      :selected-currency="localCarrier.currency"
                      @update:selectedCurrency="newValue => localCarrier.currency = newValue"
                    />
                  </slot>
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
                    :title="$t('productFeedSettings.deliveryTimeAndRates.tooltips.shippingRate')"
                  >
                    <span class="material-icons-round text-secondary mb-0 ps_gs-fz-16 w-16">
                      help_outline
                    </span>
                  </b-button>
                </div>
              </b-col>
              <b-col class="col-auto">
                <b-input-group
                  :append="currencies.length <= 1 ? localCarrier.currency : undefined"
                  class="ps_gs-carrier__input-number-group"
                >
                  <b-form-input
                    type="number"
                    class="ps_gs-carrier__input-number no-arrows ps_gs-mw-90"
                    size="sm"
                    step="0.01"
                    placeholder="5.99"
                    :state="validateAmountRate(localCarrier[localCarrier.offer].shippingCost)"
                    v-model.number="localCarrier[localCarrier.offer].shippingCost"
                    @input="onDataUpdate"
                  />
                  <slot
                    name="append"
                    v-if="currencies.length > 1"
                  >
                    <currency-dropdown
                      :currencies="currencies"
                      :selected-currency="localCarrier.currency"
                      @update:selectedCurrency="newValue => localCarrier.currency = newValue"
                    />
                  </slot>
                </b-input-group>
              </b-col>
            </b-row>
          </div>
        </b-card>
        <!-- eslint-enable max-len -->
      </b-col>
    </b-row>
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
} from '@/providers/shipping-rate-provider';
import CurrencyDropdown from './currency-dropdown.vue';

export default Vue.extend({
  name: 'CustomCarrierForm',
  components: {
    CurrencyDropdown,
  },
  props: {
    estimateCarrier: {
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
          text: this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.storeOffers.freeShippingForAllProducts'),
          value: OfferType.FREE_SHIPPING,
        },
        {
          text: this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.storeOffers.flatShippingRateForAllProducts'),
          value: OfferType.FLAT_SHIPPING_RATE,
        },
        {
          text: this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.storeOffers.freeShippingOverAmount'),
          value: OfferType.FREE_SHIPPING_OVER_AMOUNT,
        },
      ],
      localCarrier: this.estimateCarrier as CustomCarrier,
    };
  },
  computed: {
    validateTimeDelivery(): boolean|null {
      if (!this.displayValidationErrors) {
        return null;
      }
      return validateDeliveryTime(this.localCarrier) ? null : false;
    },
    validateCarrierName(): boolean|null {
      if (!this.displayValidationErrors) {
        return null;
      }
      return validateCarrierName(this.localCarrier);
    },
    validateRadio(): boolean|null {
      if (!this.displayValidationErrors) {
        return null;
      }
      if (this.localCarrier.offer) {
        return null;
      }

      return validateOfferChoice(this.localCarrier.offer);
    },
    currencies(): string[] {
      return this.$store.getters['app/GET_SHOP_CURRENCIES'];
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
    async onDataUpdate(): Promise<void> {
      this.$emit('carrierUpdated', {
        ...this.estimateCarrier,
        ...this.localCarrier,
      });
      // With the default carrier object, the form does not refresh
      // automatically so we have to force it.
      await this.$nextTick();
      this.$forceUpdate();
    },
  },

});
</script>
