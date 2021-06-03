<template>
  <b-tr>
    <b-td class="pb-0 py-md-3 align-top">
      <span class="font-weight-bold d-flex align-items-center required">
        {{ $t(`productFeedSettings.attributeMapping.${input}`) }}
        <b-button
          v-b-tooltip
          title="Tooltip!"
          variant="invisible"
          class="ml-1 p-0 border-0 ps_gs-fz-12"
        >
          <span class="material-icons-round mb-0 ps_gs-fz-12 align-middle">
            error_outline
          </span>
          <span class="sr-only">Tooltip!</span>
        </b-button>
      </span>
    </b-td>
    <b-td class="pt-0 py-md-3 align-top">
      <b-form-group class="mb-0 text-left">
        {{
          $t('productFeedSettings.attributeMapping.theXField',
              [$t(`productFeedSettings.attributeMapping.${input}`)])
        }}
        <!-- Not in Batch 1 -->
        <!-- <b-form-radio
          v-model="selectedRadio"
          :name="`${input}Radio`"
          value="default"
          class="mb-2"
        >
          {{
            $t('productFeedSettings.attributeMapping.theXField',
               [$t(`productFeedSettings.attributeMapping.${input}`)])
          }}
        </b-form-radio>
        <div class="d-sm-flex align-items-center">
          <b-form-radio
            v-model="selectedRadio"
            :name="`${input}Radio`"
            value="custom"
            class="flex-shrink-0 pr-5"
          >
            {{ $t('productFeedSettings.attributeMapping.thisCustomField') }}
          </b-form-radio>
          <b-select
            class="mb-0 mt-2 mt-md-0"
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
        </div> -->
      </b-form-group>
    </b-td>
  </b-tr>
</template>

<script>
export default {
  name: 'ProductFeedSettingsAttributeMappingTablerowSpecific',
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
