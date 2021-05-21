<template>
  <b-col
    cols
    class="ps_gs-productfeed-report-card"
  >
    <div class="px-3 py-2">
      <div class="d-flex justify-content-between font-weight-600 ps_gs-fz-13">
        <span>
          <template v-if="status === 'success'">
            <b-iconstack
              font-scale="1.5"
              class="mr-1 fixed-size text-success"
              width="16"
              height="16"
            >
              <b-icon-circle-fill
                stacked
              />
              <b-icon-check
                stacked
                variant="white"
              />
            </b-iconstack>
          </template>
          <template v-if="status === 'warning'">
            <b-icon-exclamation-triangle-fill
              width="16"
              height="16"
              variant="warning"
            />
          </template>
          {{ title }}
        </span>
        <b-link
          :href="linkTo"
          class="text-right"
        >
          {{ link }}
        </b-link>
      </div>
      <p
        class="mb-0 ps_gs-fz-12"
        :class="{'text-muted': status === 'warning'}"
      >
        {{ description }}
      </p>
      <p
        v-if="details"
        class="ps_gs-productfeed-report-card__details text-muted mb-0 ps_gs-fz-12"
      >
        {{ details }}
      </p>
    </div>
  </b-col>
</template>

<script>
import {
  BIconstack,
  BIconCheck,
  BIconCircleFill,
  BIconExclamationTriangleFill,
} from 'bootstrap-vue';

export default {
  name: 'ProductFeedCardReportCard',
  components: {
    BIconstack,
    BIconCheck,
    BIconCircleFill,
    BIconExclamationTriangleFill,
  },
  props: {
    status: {
      type: String,
      validator(value) {
        return ['success', 'warning'].indexOf(value) !== -1;
      },
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    details: {
      type: String,
    },
    link: {
      type: String,
    },
    linkTo: {
      type: String,
    },
  },
};
</script>
