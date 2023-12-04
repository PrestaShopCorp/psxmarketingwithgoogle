<template>
  <tr
    class="ps_gs-carrier"
    :class="{'ps_gs-carrier--disabled': !carrier.enabledCarrier}"
  >
    <td class="ps_gs-carrier__cell-switch">
      <b-form-checkbox
        switch
        size="sm"
        class="ps_gs-switch mb-0"
        v-model="enabledCarrier"
        @input="carrierUpdated"
        :aria-label="$t('productFeedSettings.deliveryTimeAndRates.shippingSwitchCarrier')"
      />
    </td>
    <td class="py-3">
      <b-badge
        variant="primary"
      >
        {{ carrier.country }}
      </b-badge>
    </td>
    <td class="py-3">
      <h4 class="ps_gs-carrier__title">
        {{ carrier.name }}
      </h4>
      <p class="ps_gs-carrier__description">
        {{ carrier.delay }}
      </p>
    </td>
    <td class="py-3">
      <div class="ps_gs-carrier__input-number-wrapper">
        <b-form-input
          type="number"
          class="ps_gs-carrier__input-number no-arrows"
          size="sm"
          v-model.number="minTransitTimeInDays"
          @input="carrierUpdated"

          :disabled="disableInputNumber"
          :state="timeStateDelivery"
          :placeholder="$t('general.min')"
        />
        <b-input-group
          :append="$t('general.days')"
          class="ps_gs-carrier__input-number-group flex-nowrap"
        >
          <b-form-input
            type="number"
            class="ps_gs-carrier__input-number no-arrows"
            size="sm"
            v-model.number="maxTransitTimeInDays"
            @input="carrierUpdated"
            :disabled="disableInputNumber"
            :state="timeStateDelivery"
            :placeholder="$t('general.max')"
          />
        </b-input-group>
      </div>
    </td>
    <td class="py-3">
      <b-dropdown
        variant="invisible"
        toggle-class="text-decoration-none ps_gs-carrier__btn-copy"
        menu-class="pb-2"
        class="ps_gs-carrier-dropdown"
        no-caret
        :disabled="!carrier.enabledCarrier"
        @show="updateListState"
        data-test-id="duplicateDetails"
        :ref="`dropdownCarriers${carrier.carrierId}-${carrier.country}`"
      >
        <template #button-content>
          <i
            class="material-icons"
            title="You can copy this carrier"
          >content_copy</i>
          <span class="sr-only">
            {{ $t('productFeedSettings.deliveryTimeAndRates.carriersDropdownHiddenLabel') }}
          </span>
        </template>
        <b-dropdown-header
          class="ps_gs-carrier-dropdown__header"
        >
          {{ $t('productFeedSettings.deliveryTimeAndRates.carriersDropdownHeader') }}
        </b-dropdown-header>
        <b-dropdown-form
          form-class="dropdown-form-with-checkbox text-dark px-3"
        >
          <b-form-checkbox-group
            class="mb-0"
            :name="`carriers${carrier.carrierId}`"
            v-model="selectedCarriersForDuplication"
          >
            <b-form-checkbox
              v-for="(carrierOption, index) in carriersList"
              :key="index"
              class="ps_gs-checkbox my-1 w-100"
              :disabled="isInitiatorCarrier(carrierOption.carrierId, carrierOption.country) ||
                !carrierOption.enabledCarrier"
              :value="{carrierId: carrierOption.carrierId, country: carrierOption.country}"
            >
              <span
                class="line-height-15"
                :class="{'text-dark':
                  isInitiatorCarrier(carrierOption.carrierId, carrierOption.country)
                }"
              >
                {{ carrierOption.name }} - {{ carrierOption.country }}
              </span>
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-dropdown-form>
        <b-dropdown-form
          form-class="px-3 pt-1"
        >
          <b-button
            size="sm"
            variant="primary"
            block
            @click="applyInfos"
          >
            {{ $t('cta.apply') }}
          </b-button>
        </b-dropdown-form>
      </b-dropdown>
    </td>
  </tr>
</template>

<script lang="ts">
import {PropType} from 'vue';
import {validateTransitTimes, CarrierIdentifier, DeliveryDetail} from '@/providers/shipping-settings-provider';

type State = {
  selectedCarriersForDuplication: CarrierIdentifier[];
  minTransitTimeInDays?: number;
  maxTransitTimeInDays?: number;
  enabledCarrier?: boolean;

}

export default {
  data(): State {
    return {
      selectedCarriersForDuplication: [{
        carrierId: this.carrier.carrierId,
        country: this.carrier.country,
      }],
      minTransitTimeInDays: this.carrier.minTransitTimeInDays,
      maxTransitTimeInDays: this.carrier.maxTransitTimeInDays,
      enabledCarrier: this.carrier.enabledCarrier,
    };
  },
  props: {
    carrier: {
      type: Object as PropType<DeliveryDetail>,
      required: true,
    },
    carriersList: {
      type: Array,
      required: true,
    },
    displayValidationErrors: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    timeStateDelivery(): boolean|null {
      if (!this.displayValidationErrors) {
        return null;
      }
      return validateTransitTimes(this.carrier) ? null : false;
    },
    disableInputNumber(): boolean {
      return !this.carrier.enabledCarrier;
    },
  },
  methods: {
    isInitiatorCarrier(id: string, country: string) {
      return this.carrier.carrierId === id && this.carrier.country === country;
    },
    applyInfos() {
      this.$store.dispatch('productFeed/DUPLICATE_DELIVERY_DETAILS',
        {
          sourceCarrier: {
            carrierId: this.carrier.carrierId,
            country: this.carrier.country,
          },
          destinationCarriers: this.selectedCarriersForDuplication,
        },
      );
      this.$refs[`dropdownCarriers${this.carrier.carrierId}-${this.carrier.country}`].hide();
    },
    updateListState() {
      // Find carrier in list and check it is still enabled
      this.selectedCarriersForDuplication = this.selectedCarriersForDuplication
        .filter((selectedCarrier: CarrierIdentifier) => this.carriersList
          .find((carrier: DeliveryDetail) => selectedCarrier.carrierId === carrier.carrierId
            && selectedCarrier.country === carrier.country,
          ).enabledCarrier,
        );
    },
    carrierUpdated(): void {
      this.$emit('carrierUpdated', {
        ...this.carrier,
        minTransitTimeInDays: this.minTransitTimeInDays,
        maxTransitTimeInDays: this.maxTransitTimeInDays,
        enabledCarrier: this.enabledCarrier,
      });
    },
  },
};
</script>
