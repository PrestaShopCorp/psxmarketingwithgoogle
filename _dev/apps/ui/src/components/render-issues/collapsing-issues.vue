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
          :class="`text-${iconColor(issue.severity)}`"
        >
          {{ icon(issue.severity) }}
        </i>
        <p class="mb-0 font-weight-600 ps_gs-fz-18 text-left">
          {{ issue.title }}
        </p>
      </div>
      <div
        slot="content"
        v-html="issue.htmlContent"
      />
    </card-collapse>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {BTooltip} from 'bootstrap-vue';
import CardCollapse from '@/components/commons/card-collapse.vue';
import {Severity, AccountIssue, ProductIssue} from './types';

export default defineComponent({
  name: 'CollapsingIssues',
  components: {
    CardCollapse,
  },
  data() {
    return {
      tooltipsComponents: [] as BTooltip[],
    };
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
    findAndCreateTooltips(): void {
      // Initialisation of Tooltips
      const tooltips = this.$el.querySelectorAll('.tooltip');

      tooltips.forEach((tooltip) => {
        const tooltipText = tooltip.querySelector('.tooltip-text');
        const tooltipIcon = tooltip.querySelector('.tooltip-icon');

        const $tooltip = new BTooltip({
          parent: this,

          propsData: {
            target: tooltipIcon,
            container: '#psxMktgWithGoogleApp',
            title: tooltipText?.textContent,
          },
        });

        $tooltip.$mount();
        this.tooltipsComponents.push($tooltip);
      });
    },
    unloadTooltips(): void {
      this.tooltipsComponents.forEach((tooltip) => tooltip.$destroy());
    },
  },
  mounted() {
    // Because the HTML code comes from Google API, we have to bend it
    // to use specific features of our application.
    this.findAndCreateTooltips();
  },
});
</script>
