<template>
  <div
    class="ps_gs-productfeed__products-status border border-600-20 rounded col mx-1"
  >
    <b-skeleton-wrapper
      :loading="loading"
    >
      <template #loading>
        <div
          class="d-flex flex-column align-items-center p-2"
        >
          <b-skeleton
            width="70%"
            class="mt-2 mb-3"
          />
          <b-skeleton
            width="100%"
          />
          <b-skeleton
            width="100%"
            class="mb-2"
          />
          <b-skeleton
            width="20%"
            height="2.5em"
          />
        </div>
      </template>

      <div
        class="d-flex flex-column align-items-center p-2"
      >
        <span
          class="d-flex align-items-center ps_gs-fz-18 font-weight-600 text-center pt-1 pb-2"
          data-test-id="pf-status-title"
        >
          <span
            class="material-icons-round ps_gs-fz-20 mr-1"
            :class="`text-${status.variant}`"
          >
            {{ status.icon }}
          </span>
          {{ status.title }}
        </span>
        <span
          class="text-center pb-1"
          data-test-id="pf-status-description"
        >
          {{ status.description }}
        </span>
        <b-card
          :border-variant="badgeBorderVariant"
          :text-variant="badgeTextVariant"
          :bg-variant="badgeBackgroundVariant"
          class="ps_gs-productfeed__badge ps_gs-fz-20 mt-auto"
          body-class="py-0 px-3"
        >
          {{ badgeValue }}
        </b-card>
        <b-link
          v-if="status.link"
          v-bind="status.link"
          class="stretched-link"
        />
      </div>
    </b-skeleton-wrapper>
  </div>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';

export type StatusCardParameters = {
  title: string;
  description: string;
  value: string | null;
  reverseColors: boolean;
  variant: string;
  link?: {
    to?: {
      name: string;
    };
    href?: string;
  };
};

export default defineComponent({
  props: {
    status: {
      type: Object as PropType<StatusCardParameters>,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    badgeValue(): string {
      return this.status.value || '--';
    },
    badgeBorderVariant(): string|null {
      if (this.status.reverseColors) {
        return null;
      }
      return this.status.variant;
    },
    badgeTextVariant(): string|null {
      if (this.status.reverseColors) {
        return 'white';
      }
      return this.status.variant;
    },
    badgeBackgroundVariant(): string|null {
      if (this.status.reverseColors) {
        return this.status.variant;
      }
      return 'white';
    },
  },
});
</script>
