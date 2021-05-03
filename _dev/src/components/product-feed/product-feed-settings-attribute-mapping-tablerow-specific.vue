<template>
  <b-tr>
    <b-td class="align-top">
      <span class="font-weight-bold d-flex align-items-center">
        {{ $t(`productFeedSettings.attributeMapping.${input}`) }}
        <b-button
          v-b-tooltip
          title="Tooltip!"
          variant="invisible"
          class="ml-1 p-0 border-0 ps_gs-fz-12"
        >
          <b-icon-exclamation-circle />
          <span class="sr-only">Tooltip!</span>
        </b-button>
      </span>
    </b-td>
    <b-td class="align-top">
      <b-form-group class="mb-0 text-left">
        <b-form-radio
          v-model="selectedRadio"
          :name="`${input}Radio`"
          value="default"
          class="mb-2"
        >
          {{ $t('productFeedSettings.attributeMapping.theXField', [$t(`productFeedSettings.attributeMapping.${input}`)]) }}
        </b-form-radio>
        <div class="d-flex align-items-center">
          <b-form-radio
            v-model="selectedRadio"
            :name="`${input}Radio`"
            value="custom"
            class="flex-shrink-0 pr-5"
          >
            {{ $t('productFeedSettings.attributeMapping.thisCustomField') }}
          </b-form-radio>
          <b-select
            class="mb-0"
            :disabled="disabledSelect"
          >
            <b-form-select-option
              v-for="(option, index) in ['Option 1', 'Option 2']"
              :key="index"
              :value="index"
            >
              {{ option }}
            </b-form-select-option>
          </b-select>
        </div>
      </b-form-group>
    </b-td>
  </b-tr>
</template>

<script>
import {
  BIconExclamationCircle,
} from 'bootstrap-vue';

export default {
  name: 'ProductFeedSettingsAttributeMappingTablerowSpecific',
  components: {
    BIconExclamationCircle,
  },
  props: {
    input: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedRadio: 'default',
    };
  },
  computed: {
    disabledSelect() {
      return this.selectedRadio !== 'custom';
    },
  },
};
</script>
