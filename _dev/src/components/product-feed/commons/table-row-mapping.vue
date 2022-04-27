<template>
  <b-tr class="table-border-bottom">
    <b-td class="align-top">
      <div class="container-mapping-summary">
        <span class="d-flex align-items-center font-weight-600">
          {{ $t(`productFeedSettings.attributeMapping.${attribute.google}`) }}
        </span>
      </div>
    </b-td>
    <b-td class="align-top">
      <div class="container-mapping-summary">
        <span
          class="mb-0 text-right ellipsis-mapping-summary-text
          d-flex align-items-end justify-content-end"
          :class="{'text-danger-light': attributeNotMapped}"
        >
          <i
            class="material-icons-outlined ps_gs-fz-20"
            v-if="attributeNotMapped"
          >
            edit
          </i>
          {{
            attribute.prestashop || $t('productFeedSettings.attributeMapping.notAvailable')
          }}
        </span>
      </div>
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
