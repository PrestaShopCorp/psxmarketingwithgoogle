<template>
  <b-tr class="gs-table-attribute-mapping__row">
    <b-td class="gs-table-attribute-mapping__column">
      {{ $t(`productFeedSettings.attributeMapping.${attribute.google}`) }}
    </b-td>
    <b-td class="gs-table-attribute-mapping__column">
      <div>
        <div
          v-if="attributeArray.length"
          class="gs-table-attribute-mapping__tag-container"
        >
          <span
            v-for="(attributeItem, index) in attributeArray"
            :key="`attribute-${index}`"
            class="gs-table-attribute-mapping__tag"
          >{{ attributeItem }}</span>
        </div>
        <div v-else>
          {{ $t('productFeedSettings.attributeMapping.notAvailable') }}
        </div>
      </div>
    </b-td>
  </b-tr>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {MappedAttribute} from '@/components/product-feed/settings/summary/types';

export default defineComponent({
  props: {
    attribute: {
      type: Object as PropType<MappedAttribute>,
      required: true,
    },
  },
  computed: {
    attributeArray() {
      return this.$props.attribute.prestashop.split(', ');
    },
  },
});
</script>
