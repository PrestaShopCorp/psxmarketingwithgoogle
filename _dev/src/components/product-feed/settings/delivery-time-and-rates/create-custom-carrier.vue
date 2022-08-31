<template>
  <div>
    <p class="h3 mb-2 font-weight-600">
      {{ $t('productFeedSettings.deliveryTimeAndRates.rateAndDelivery') }}
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
                <input
                  type="text"
                  class="form-control"
                  style="max-width: 200px;"
                  id="carrierName"
                  v-model="carrierName"
                  placeholder="Description"
                  max="90"
                >
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
                <input
                  class="form-check-input"
                  name="offersChoice"
                  type="radio"
                  v-model="offerChosen"
                  :id="`${offer.name}${index}`"
                  :value="offer.value"
                  :checked="offer.checked"
                >
                <label
                  class="form-check-label"
                  :for="`${offer.name}${index}`"
                >
                  {{ offer.name }}
                </label>
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
                      class="ps_gs-carrier__input-number no-arrows"
                      size="sm"
                      :placeholder="$t('general.max')"
                    />
                  </b-input-group>
                </div>
              </b-col>
            </b-row>
            <shipping-rate :offer-chosen="offerChosen" />
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {OfferType} from '@/enums/product-feed/offer';
import ShippingRate from '@/components/product-feed/settings/delivery-time-and-rates/shipping-rate.vue';

export default Vue.extend({
  name: 'ProductFeedSettingsShipping',
  components: {
    ShippingRate,
  },
  data() {
    return {
      carrierName: '',
      offerChosen: '',
      offers: [
        {
          name: this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.storeOffers.freeShippingRateForAllProducts'),
          value: OfferType.FLAT_SHIPPING_RATE,
          checked: false,
        },
        {
          name: this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.storeOffers.freeShippingForAllProducts'),
          value: OfferType.FREE_SHIPPING,
          checked: false,
        },
        {
          name: this.$t('productFeedSettings.deliveryTimeAndRates.estimateStep.storeOffers.freeShippingOverAmount'),
          value: OfferType.FREE_SHIPPING_OVER_AMOUNT,
          checked: false,
        },
      ],
    };
  },
  computed: {
  },
  methods: {
  },
});
</script>
