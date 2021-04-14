<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled' : !isEnabled }"
  >
    <div
      class="d-md-flex flex-wrap align-items-center justify-content-between mb-3"
    >
      <div class="d-flex align-items-center">
        <img
          class="mr-3"
          :src="isEnabled ? require('@/assets/images/product-feed-icon.svg') : require('@/assets/images/product-feed-icon-grey.svg')"
          width="40"
          height="40"
        />
        <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
          Product feed
        </b-card-text>
      </div>
    </div>
    <p class="ps_gs-fz-12">
      Allows you to display your products either free on Google Shopping tab and/or paid Smart Shopping campaigns
    </p>
    <div class="d-flex mt-2">
      <span
       class="mr-2"
      >
        <b-icon-exclamation-circle></b-icon-exclamation-circle>
      </span>
      <ul class="list-inline mb-0">
        <li
          class="list-inline-item"
          v-b-tooltip.hover
          title="Tooltip directive content"
        >
          <b-badge variant="muted">Merchant Center account</b-badge>
        </li>
        <li
          class="list-inline-item"
          v-b-tooltip.hover
          title="Tooltip directive content"
        >
          <b-badge variant="muted">Product feed settings</b-badge>
        </li>
      </ul>
    </div>
  </b-card>
</template>

<script>
import { BIconstack, BIconCheck, BIconCircleFill, BIconExclamationCircle, BTooltip } from "bootstrap-vue";

export default {
  name: "ProductFeedCard",
  components: {
    BIconstack,
    BIconCheck,
    BIconCircleFill,
    BIconExclamationCircle,
    BTooltip
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    }
  }
};
</script>
