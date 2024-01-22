<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import CardCollapse from '@/components/commons/card-collapse.vue';
import {Severity} from './types';
import {AccountIssue} from './account-issues.types';
import {ProductIssue} from './product-issues.types';

export default defineComponent({
  name: 'CollapsingIssues',
  components: {
    CardCollapse,
  },
  props: {
    issues: {
      type: Array as PropType<(AccountIssue|ProductIssue)[]>,
      required: true,
    },
  },
  methods: {
    iconColor(severity: Severity): string {
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
    icon(severity: Severity): string {
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
