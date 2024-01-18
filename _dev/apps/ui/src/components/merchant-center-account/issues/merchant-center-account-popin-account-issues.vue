<template>
  <ps-modal
    id="MerchantCenterAccountPopinAccountIssues"
    ref="modal"
    :title="$t('gmcAccountIssues.title')"
    v-bind="$attrs"
  >
    <VueShowdown
      class="mb-3"
      :markdown="$t('gmcAccountIssues.description')"
    />
    <card-collapse
      v-for="issue in issues"
      :key="issue.title"
      class="mt-3"
      visible
    >
      <div
        slot="title"
        class="d-flex align-items-center"
      >
        <i
          class="material-icons ps_gs-fz-20 mr-1"
          :class="`text-${iconColor(issue.impact.severity)}`"
        >
          {{ icon(issue.impact.severity) }}
        </i>
        <p class="mb-0 font-weight-600 ps_gs-fz-18">
          {{ issue.title }}
        </p>
      </div>
      <div
        slot="content"
        v-html="issue.prerenderedContent"
      />
    </card-collapse>

    <template slot="modal-footer">
      <span />
    </template>
  </ps-modal>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import PsModal from '@/components/commons/ps-modal.vue';
import CardCollapse from '@/components/commons/card-collapse.vue';
import {AccountIssue, ErrorSeverity} from './types';

export default defineComponent({
  name: 'MerchantCenterAccountPopinAccountIssues',
  components: {
    PsModal,
    CardCollapse,
  },
  props: {
    issues: {
      type: Array as PropType<AccountIssue[]>,
      required: true,
    },
  },
  methods: {
    iconColor(severity: ErrorSeverity): string {
      if (severity === 'ERROR') {
        return 'danger';
      }
      if (severity === 'WARNING') {
        return 'warning';
      }
      if (severity === 'INFO') {
        return 'info';
      }
      return 'primary';
    },
    icon(severity: ErrorSeverity): string {
      if (severity === 'ERROR') {
        return 'error';
      }
      if (severity === 'WARNING') {
        return 'warning';
      }
      return 'info';
    },
  },
});
</script>
