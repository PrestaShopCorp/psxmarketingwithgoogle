<template>
  <b-col
    cols
    class="ps_gs-productfeed-report-card"
  >
    <div class="px-3 py-2">
      <div class="d-flex align-items-center ml-n1 mt-n1 mb-2">
        <b-badge :variant="badgeVariant">
          {{ badgeText }}
        </b-badge>
        <b-button
          variant="invisible"
          class="p-0 mt-0 ml-1"
          v-b-tooltip.hover
          :title="badgeTooltip"
        >
          <b-icon-exclamation-circle
            width="14"
            height="14"
            class="align-middle d-inline-block"
          />
        </b-button>
      </div>
      <i
        v-if="syncStatus === 'busy'"
        class="icon-busy icon-busy--dark d-block"
      />
      <div
        v-else
        class="d-flex justify-content-between"
      >
        <span class="ps_gs-fz-12 font-weight-600">
          {{ nbProducts }}
        </span>
        <a
          v-if="ctaText"
          :href="ctaLink"
          class="ps_gs-fz-12 font-weight-600"
        >
          {{ ctaText }}
        </a>
      </div>
    </div>
  </b-col>
</template>

<script>
import {
  BIconExclamationCircle,
} from 'bootstrap-vue';

export default {
  name: 'ProductFeedCardReportCard',
  components: {
    BIconExclamationCircle,
  },
  props: {
    badgeVariant: {
      type: String,
    },
    badgeText: {
      type: String,
    },
    badgeTooltip: {
      type: String,
    },
    syncStatus: {
      type: String,
    },
    nbProducts: {
      type: Number,
    },
    ctaText: {
      type: String,
    },
    ctaLink: {
      type: String,
    },
  },
};
</script>
