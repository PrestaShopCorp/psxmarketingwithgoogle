<template>
  <tr
    class="ps_gs-carrier"
    :class="{'ps_gs-carrier--disabled': !enabled}"
  >
    <td class="ps_gs-carrier__cell-switch">
      <b-form-checkbox
        switch
        size="sm"
        class="ps_gs-switch mb-0"
        v-model="enabled"
        @change="toggleCarrier"
        :aria-label="$t('productFeedSettings.shipping.shippingSwitchCarrier')"
      />
    </td>
    <td class="py-3">
      <h4 class="ps_gs-carrier__title">
        {{ carrier.name }}
      </h4>
      <p class="ps_gs-carrier__description">
        {{ carrier.delay }}
      </p>
    </td>
    <td>
      <b-dropdown
        :ref="`dropdownCarriers${carrier.id_carrier}`"
        :text="deliveryTypeMessage || $t('cta.select')"
        variant="text"
        class="maxw-sm-160 ps-dropdown ps_gs-carrier__dropdown-delivery-type
        psxmarketingwithgoogle-dropdown bordered"
        :toggle-class="{'ps-dropdown__placeholder' : deliveryTypeMessage === null}"
        menu-class="ps-dropdown"
        size="sm"
        :disabled="!enabled"
      >
        <b-dropdown-item-button
          button-class="rounded-0 text-dark"
          @click="updateDelivery('delivery')"
        >
          <span
            class="px-2"
          >
            {{ $t('cta.yes') }}
          </span>
        </b-dropdown-item-button>
        <b-dropdown-item-button
          button-class="rounded-0 text-dark"
          @click="updateDelivery('pickup')"
        >
          <span
            class="px-2"
          >
            {{ $t('cta.no') }}
          </span>
        </b-dropdown-item-button>
      </b-dropdown>
    </td>
    <td class="py-3">
      <div class="ps_gs-carrier__input-number-wrapper">
        <b-form-input
          type="number"
          class="ps_gs-carrier__input-number no-arrows"
          size="sm"
          v-model="minHandlingTimeInDays"
          :disabled="!enabled"
          :state="timeState('handling')"
          :placeholder="$t('general.min')"
        />
        <b-form-input
          type="number"
          class="ps_gs-carrier__input-number no-arrows"
          size="sm"
          v-model="maxHandlingTimeInDays"
          :disabled="!enabled"
          :state="timeState('handling')"
          :placeholder="$t('general.max')"
        />
      </div>
    </td>
    <td class="py-3">
      <div class="ps_gs-carrier__input-number-wrapper">
        <b-form-input
          type="number"
          class="ps_gs-carrier__input-number no-arrows"
          size="sm"
          v-model="minTransitTimeInDays"
          :disabled="!enabled"
          :state="timeState('delivery')"
          :placeholder="$t('general.min')"
        />
        <b-form-input
          type="number"
          class="ps_gs-carrier__input-number no-arrows"
          size="sm"
          v-model="maxTransitTimeInDays"
          :disabled="!enabled"
          :state="timeState('delivery')"
          :placeholder="$t('general.max')"
        />
      </div>
    </td>
    <td class="py-3">
      <b-dropdown
        variant="invisible"
        toggle-class="text-decoration-none ps_gs-carrier__btn-copy"
        menu-class="pb-2"
        class="ps_gs-carrier-dropdown"
        no-caret
        :disabled="!enabled"
        @show="updateListState"
      >
        <template #button-content>
          <i class="material-icons">control_point_duplicate</i>
          <span class="sr-only">
            {{ $t('productFeedSettings.shipping.carriersDropdownHiddenLabel') }}
          </span>
        </template>
        <b-dropdown-header
          class="ps_gs-carrier-dropdown__header"
        >
          {{ $t('productFeedSettings.shipping.carriersDropdownHeader') }}
        </b-dropdown-header>
        <b-dropdown-form
          form-class="dropdown-form-with-checkbox text-dark px-3"
        >
          <b-form-checkbox-group
            class="mb-0"
            :name="`carriers${carrier.id_carrier}`"
            v-model="selectedIds"
          >
            <b-form-checkbox
              @change="checkboxClicked(carrierOption)"
              v-for="carrierOption in carriersList"
              :key="carrierOption.name"
              class="ps_gs-checkbox my-1"
              :disabled="isInitiatorCarrier(carrierOption.carrierId) ||
                !carrierOption.enabledCarrier"
              :value="carrierOption.carrierId"
            >
              <span
                class="line-height-15"
                :class="{'text-dark': isInitiatorCarrier(carrierOption.carrierId)}"
              >
                {{ carrierOption.name }}
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

<script>
import DeliveryType from '@/enums/product-feed/delivery-type.ts';

export default {
  data() {
    return {
      selectedIds: [],
      deliveryType: this.carrier.deliveryType || null,
      enabled: this.carrier.enabledCarrier || false,
      transitTime: {
        min: null,
        max: null,
      },
      handlingTime: {
        min: null,
        max: null,
      },
    };
  },
  props: {
    carrier: {
      type: Object,
      required: true,
    },
    carriersList: {
      type: Array,
      required: true,
    },
  },
  computed: {
    deliveryTypeMessage() {
      switch (this.deliveryType) {
        case DeliveryType.DELIVERY:
          return this.$i18n.t('cta.yes');
        case DeliveryType.PICKUP:
          return this.$i18n.t('cta.no');
        default:
          return null;
      }
    },
    minHandlingTimeInDays: {
      get() {
        return this.carrier.minHandlingTimeInDays || this.handlingTime.min;
      },
      set(value) {
        this.handlingTime.min = value;
        this.$emit('updateCarrier', {
          type: 'minHandlingTimeInDays',
          carrierId: this.carrier.carrierId,
          minHandlingTimeInDays: Number(value),
        });
      },
    },
    maxHandlingTimeInDays: {
      get() {
        return this.carrier.maxHandlingTimeInDays || this.handlingTime.max;
      },
      set(value) {
        this.handlingTime.max = value;
        this.$emit('updateCarrier', {
          type: 'maxHandlingTimeInDays',
          carrierId: this.carrier.carrierId,
          maxHandlingTimeInDays: Number(value),

        });
      },
    },
    maxTransitTimeInDays: {
      get() {
        return this.carrier.maxTransitTimeInDays || this.transitTime.max;
      },
      set(value) {
        this.transitTime.max = value;
        this.$emit('updateCarrier', {
          type: 'maxTransitTimeInDays',
          carrierId: this.carrier.carrierId,
          maxTransitTimeInDays: Number(value),
        });
      },
    },
    minTransitTimeInDays: {
      get() {
        return this.carrier.minTransitTimeInDays || this.transitTime.min;
      },
      set(value) {
        this.transitTime.min = value;
        this.$emit('updateCarrier', {
          type: 'minTransitTimeInDays',
          carrierId: this.carrier.carrierId,
          minTransitTimeInDays: Number(value),
        });
      },
    },

  },
  methods: {
    isInitiatorCarrier(id) {
      return this.carrier.carrierId === id;
    },
    toggleCarrier() {
      this.$emit('updateCarrier', {
        type: 'enabledCarrier',
        carrierId: this.carrier.carrierId,
        enabledCarrier: this.enabled,
      });
    },
    updateDelivery(deliveryChosen) {
      this.deliveryType = deliveryChosen;
      this.$emit('updateCarrier', {
        type: 'deliveryType',
        carrierId: this.carrier.carrierId,
        deliveryType: deliveryChosen,
      });
    },
    timeState(type) {
      if (type === 'handling') {
        return this.minHandlingTimeInDays > this.maxHandlingTimeInDays
          && this.minHandlingTimeInDays
          && this.maxHandlingTimeInDays ? false : null;
      } return this.minTransitTimeInDays > this.maxTransitTimeInDays
            && this.minTransitTimeInDays
            && this.maxTransitTimeInDays ? false : null;
    },
    checkboxClicked(option) {
      console.log(option);
    },
    applyInfos() {
      console.log(this.carrier);
      console.log(this.carriersList);
      this.$refs[`dropdownCarriers${this.carrier.id_carrier}`].showMenu();
    },
    updateListState() {
      // if element is disabled, uncheck it
      const idToDelete = [];
      this.carriersList.forEach((carrier) => {
        if (!carrier.enabledCarrier) {
          idToDelete.push(carrier.carrierId);
        }
      });
      this.selectedIds = this.selectedIds.filter((selectedId) => !idToDelete.includes(selectedId));
    },
  },
  beforeMount() {
    this.enabled = this.carrier.enabledCarrier;
    this.selectedIds = [this.carrier.carrierId];
  },
};
</script>
