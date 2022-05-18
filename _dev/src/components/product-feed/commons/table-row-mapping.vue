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
          <b-button
            class="m-n2 pr-2 text-danger-light"
            variant="link"
            @click="editAttribute"
          >
            <i
              class="material-icons-outlined ps_gs-fz-20"
              v-if="attributeNotMapped"
            >
              edit
            </i>
          </b-button>
          {{
            attribute.prestashop || $t('productFeedSettings.attributeMapping.notAvailable')
          }}
        </span>
      </div>
    </b-td>
  </b-tr>
</template>

<script>
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';

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
    attributeToMap() {
      return (this.attribute
       && (this.attribute.prestashop
        || this.attribute.google));
    },
  },
  methods: {
    editAttribute() {
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.ATTRIBUTE_MAPPING,
        },
        hash: `#${this.attributeToMap}`,
      });
    },
  },
};
</script>
