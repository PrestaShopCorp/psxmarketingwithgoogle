<template>
  <section
    class="tiny-lux-sync-job-status"
    aria-live="polite"
  >
    <p class="font-weight-600 mb-1">
      {{ job.succeeded }} {{ $t('tinyLuxGoogle.of') }} {{ job.total }}
      {{ $t('tinyLuxGoogle.productsSynchronized') }}
    </p>
    <p class="text-muted mb-2">
      {{ job.failed }} {{ $t('tinyLuxGoogle.failed') }} ·
      {{ job.skipped }} {{ $t('tinyLuxGoogle.skipped') }} ·
      {{ job.pending }} {{ $t('tinyLuxGoogle.pending') }}
    </p>
    <ul
      v-if="jobErrors.length"
      class="list-unstyled mb-3"
      data-test="sync-errors"
    >
      <li
        v-for="error in jobErrors"
        :key="`${error.offerKey}-${error.code}-${error.field}`"
        class="alert alert-warning py-2 px-3 mb-2"
      >
        <strong>{{ error.offerKey }}</strong>
        <span v-if="error.field"> · {{ error.field }}</span>
        <span class="d-block">{{ error.message }}</span>
      </li>
    </ul>
    <b-button
      v-if="canRetry"
      data-test="retry-failed"
      size="sm"
      variant="outline-primary"
      @click="$emit('retry', job.jobId)"
    >
      {{ $t('tinyLuxGoogle.retryFailed') }}
    </b-button>
  </section>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {SyncJob, SyncJobError} from '@/store/modules/product-feed/state';

export default defineComponent({
  name: 'SyncJobStatus',
  props: {
    job: {
      type: Object as PropType<SyncJob>,
      required: true,
    },
  },
  computed: {
    jobErrors(): SyncJobError[] {
      return Array.isArray(this.job.errors) ? this.job.errors : [];
    },
    canRetry(): boolean {
      return this.job.failed > 0 && !['pending', 'running'].includes(this.job.status);
    },
  },
});
</script>
