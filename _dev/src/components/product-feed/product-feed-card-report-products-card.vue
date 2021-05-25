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
          v-b-tooltip:googleShoppingApp
          :title="badgeTooltip"
        >
          <i class="material-icons ps_gs-fz-14 color-grey_darklight">info_outline</i>
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
export default {
  name: 'ProductFeedCardReportCard',
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
