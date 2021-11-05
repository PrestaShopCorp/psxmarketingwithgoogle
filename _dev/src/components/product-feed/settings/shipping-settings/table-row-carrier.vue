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
    <td class="text-right">
      <b-dropdown
        :ref="`dropdownCarriers${carrier.id_carrier}`"
        :text="deliveryTypeMessage"
        variant="text"
        class="maxw-sm-80 ps-dropdown ps_gs-carrier__dropdown
        psxmarketingwithgoogle-dropdown bordered"
        menu-class="ps-dropdown"
        size="sm"
        :disabled="!enabled"
      >
        <b-dropdown-item-button
          button-class="rounded-0 text-dark"
          @click="deliveryType = 'delivery'"
        >
          <span
            class="px-2"
          >
            {{ $t('cta.yes') }}
          </span>
        </b-dropdown-item-button>
        <b-dropdown-item-button
          button-class="rounded-0 text-dark"
          @click="deliveryType = 'pickup'"
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
          :min="0"
          :disabled="!enabled"
        />
        <b-form-input
          type="number"
          class="ps_gs-carrier__input-number no-arrows"
          size="sm"
          v-model="maxHandlingTimeInDays"
          :min="this.minHandlingTimeInDays"
          :disabled="!enabled"
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
          :min="0"
          :disabled="!enabled"
        />
        <b-form-input
          type="number"
          class="ps_gs-carrier__input-number no-arrows"
          size="sm"
          v-model="maxTransitTimeInDays"
          :min="this.minTransitTimeInDays"
          :disabled="!enabled"
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
              v-for="carrierOption in carriersList"
              :key="carrierOption.name"
              class="ps_gs-checkbox my-1"
              :disabled="isInitiatorCarrier(carrierOption.id_carrier) ||
                !carrierOption.enabledCarrier"
              :value="carrierOption.id_carrier"
            >
              <span
                class="line-height-15"
                :class="{'text-dark': isInitiatorCarrier(carrierOption.id_carrier)}"
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
      enabled: true,
      minHandlingTimeInDays: null,
      maxHandlingTimeInDays: null,
      minTransitTimeInDays: null,
      maxTransitTimeInDays: null,
      deliveryType: DeliveryType.DELIVERY,
      selectedIds: [],
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
        default:
          return this.$i18n.t('cta.no');
      }
    },
  },
  methods: {
    isInitiatorCarrier(id) {
      return this.carrier.id_carrier === id;
    },
    toggleCarrier() {
      this.$emit('toggleCarrier', {
        id_carrier: this.carrier.id_carrier,
        enabledCarrier: this.enabled,
      });
    },
    applyInfos() {
      // TODO: apply to selected checkbox
      this.$refs[`dropdownCarriers${this.carrier.id_carrier}`].showMenu();
    },
    updateListState() {
      // if element is disabled, uncheck it
      const idToDelete = [];
      this.carriersList.forEach((carrier) => {
        if (!carrier.enabledCarrier) {
          idToDelete.push(carrier.id_carrier);
        }
      });
      this.selectedIds = this.selectedIds.filter((selectedId) => !idToDelete.includes(selectedId));
    },
  },
  beforeMount() {
    this.enabled = this.carrier.enabledCarrier;
    this.selectedIds = [this.carrier.id_carrier];
  },
};
</script>
