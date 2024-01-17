<template>
  <b-skeleton-wrapper
    :loading="loading"
  >
    <template #loading>
      <b-row class="mb-2">
        <b-col>
          <b-skeleton
            width="30%"
            height="33px"
          />
        </b-col>
        <b-col cols="4">
          <b-skeleton
            width="100%"
            height="33px"
          />
        </b-col>
      </b-row>
    </template>

    <div class="d-flex justify-content-between mb-2">
      <b-button
        v-if="!inNeedOfConfiguration && accountHasAtLeastOneCampaign"
        size="sm"
        variant="primary"
        @click="$emit('clickToCreateCampaign')"
        data-test-id="campaign-creation-button"
      >
        {{ $t('cta.createPMaxCampaign') }}
      </b-button>
      <KeyMetricsPeriodSelector
        :in-need-of-configuration="inNeedOfConfiguration || !accountHasAtLeastOneCampaign"
        class="ml-auto"
      />
    </div>
  </b-skeleton-wrapper>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import KeyMetricsPeriodSelector from '@/components/campaign/reporting/key-metrics/key-metrics-period-selector.vue';

export default defineComponent({
  name: 'KeyMetricsControls',
  components: {
    KeyMetricsPeriodSelector,
  },
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    accountHasAtLeastOneCampaign: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
