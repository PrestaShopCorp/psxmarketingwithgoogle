<template>
  <b-tr>
    <b-td
      class="pb-0 align-top"
      :class="isReport ? 'pt-md-0 pb-md-1' : 'py-md-3'"
    >
      <span
        class="d-flex align-items-center"
        :class="{'font-weight-bold ps_gs-required' : !isReport}"
      >
        {{
          isReport
            ? $t('productFeedSettings.summary.xItems',
                 [$t(`productFeedSettings.attributeMapping.${input}`)])
            : $t(`productFeedSettings.attributeMapping.${input}`)
        }}
        <b-button
          v-if="!isReport"
          v-b-tooltip
          title="Tooltip!"
          variant="invisible"
          class="ml-1 p-0 border-0 ps_gs-fz-12 color-grey_darklight"
        >
          <span class="material-icons-round mb-0 ps_gs-fz-12 align-middle">
            error_outline
          </span>
        </b-button>
        <span
          v-else
          class="material-icons-round ml-auto ps_gs-fz-20 mr-md-2 mb-0 align-middle text-success"
        >
          link
        </span>
      </span>
    </b-td>
<<<<<<< HEAD
    <b-td
      class="pb-0 align-top"
      :class="isReport ? 'pt-md-0 pb-md-1' : 'py-md-3'"
    >
      <b-form-group class="mb-0 text-left">
        {{
          isReport
            ? $t(`productFeedSettings.attributeMapping.${input}`)
            : $t('productFeedSettings.attributeMapping.theXField', [
              $t(`productFeedSettings.attributeMapping.${input}`)
            ])
        }}
=======
    <b-td class="pt-0 py-md-3 align-top">
      <b-form-group
        class="mb-0 text-left"
        v-html="$t('productFeedSettings.attributeMapping.theXField',
                   [$t(`productFeedSettings.attributeMapping.${input}`)])"
      >
>>>>>>> cb9c7df (step 3)
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
    isReport: {
      type: Boolean,
      default: false,
      required: false,
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
