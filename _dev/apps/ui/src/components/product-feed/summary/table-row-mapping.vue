<template>
  <b-tr class="gs-table-attribute-mapping__row">
    <b-td class="gs-table-attribute-mapping__column">
      {{ $t(`productFeedSettings.attributeMapping.${attribute.google}`) }}
    </b-td>
    <b-td class="gs-table-attribute-mapping__column">
      <div>
        <div
          v-if="attributeArray.length"
          class="gs-table-attribute-mapping--tag-container"
        >
          <span
            v-for="(attributeItem, index) in attributeArray"
            :key="`attribute-${index}`"
            class="gs-table-attribute-mapping--tag"
          >{{ attributeItem }}</span>
        </div>
        <div v-else>
          {{ $t('productFeedSettings.attributeMapping.notAvailable') }}
        </div>
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
    attributeArray() {
      return this.$props.attribute.prestashop.split(', ');
    },
  },
};
</script>
