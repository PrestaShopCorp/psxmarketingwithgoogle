<template>
  <b-tr>
    <b-td class="pb-0 align-top pt-md-0 pb-md-1">
      <span class="d-flex align-items-center">
        {{ $t(`productFeedSettings.attributeMapping.${attribute.google}`) }}
        <span
          class="material-icons-round ml-auto ps_gs-fz-20 mr-md-2 mb-0 align-middle text-success"
        >
          link
        </span>
      </span>
    </b-td>
    <b-td class="pb-0 align-top pt-md-0 pb-md-1">
      <span
        class="mb-0 text-left"
        :class="{'text-secondary': attributeNotMapped}"
      >
        {{
          attribute.prestashop || $t('productFeedSettings.attributeMapping.notAvailable')
        }}
      </span>
    </b-td>
  </b-tr>
</template>

<script>
export default {
  props: {
    attribute: {
      type: Object,
      required: true,
    },
  },
  computed: {
    attributeNotMapped() {
      return this.attribute.prestashop === '';
    },
  },
};
</script>
