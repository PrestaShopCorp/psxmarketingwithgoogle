<template>
  <b-alert
    v-if="isMultiShop"
    variant="warning"
    show
  >
    <h2>{{ $t('multiShopSelector.title') }}</h2>
    <p>{{ $t('multiShopSelector.subtitle') }}.</p>
    <p>{{ $t('multiShopSelector.selectStore') }}:</p>
    <b-list-group
      v-for="group in shops"
      :key="group.id"
      class="my-3"
    >
      <p v-if="isMultiGroup">
        <label class="text-muted">
          {{ $t('multiShopSelector.group') }}:
        </label>
        {{ group.name }}
      </p>
      <b-list-group-item
        v-for="shop in group.shops"
        :key="shop.id"
        href="#"
        @click="event(shop)"
        class="list-group-item maxw-sm-420"
      >
        {{ $t('multiShopSelector.configure') }} <b>{{ shop.name }}</b>
      </b-list-group-item>
    </b-list-group>
    <p>{{ $t('multiShopSelector.tips') }}.</p>
  </b-alert>
</template>

<script>
import {BAlert, BListGroup, BListGroupItem} from 'bootstrap-vue';
/**
 * This sub-component can be used in a custom integration when the `PsAccounts`
 * component does not meets special needs. This part will display a selector
 * to let the user choose which shop to choose before linking process (each shop
 * in a multi-shop context has to be linked separately, possibly with a different
 * user account).
 */
export default {
  name: 'MultiStoreSelector',
  components: {
    BAlert,
    BListGroup,
    BListGroupItem,
  },
  props: {
    /**
     * The shops object, generated
     * [by prestashop\_accounts\_auth library presenter function](https://github.com/PrestaShopCorp/prestashop_accounts_auth#usage).
     */
    shops: {
      type: Array,
      required: true,
    },
  },
  methods: {
    event(selectedShop) {
      /**
       * Emitted when a shop is selected.
       * @type {Event}
       */
      this.$emit('shop-selected', selectedShop);
    },
  },
  computed: {
    isMultiShop() {
      return Boolean(this.shops.length >= 1);
    },
    isMultiGroup() {
      return Boolean(this.shops.length > 1);
    },
  },
};
</script>
