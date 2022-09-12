<template>
  <b-col
    cols
    class="ps_gs-productfeed-report-card"
    :class="size && `ps_gs-productfeed-report-card--${size}`"
  >
    <div class="px-3 py-2">
      <div class="d-flex justify-content-between font-weight-600 ps_gs-fz-13 mb-1">
        <div class="d-flex align-items-center">
          <i
            v-if="status === 'success'"
            class="material-icons ps_gs-fz-18 mb-0 mr-2"
            :class="`text-${status}`"
          >
            check_circle
          </i>
          <i
            v-else
            class="material-icons-round ps_gs-fz-18 mb-0 mr-2"
            :class="`text-${status}`"
          >
            warning
          </i>
          {{ title }}
        </div>
        <b-link
          @click="goTo(linkTo)"
          class="text-right"
        >
          {{ link }}
        </b-link>
      </div>
      <p
        v-if="subTitle"
        class="mb-0 ps_gs-fz-12"
      >
        <b>{{ subTitle }}</b>
      </p>
      <p
        v-if="description"
        class="mb-0 ps_gs-fz-12"
      >
        {{ description }}
      </p>
      <p
        v-if="subTitle2"
        class="mt-2 mb-0 ps_gs-fz-12"
      >
        <b>{{ subTitle2 }}</b>
      </p>
      <p
        v-if="description2"
        class="mb-0 ps_gs-fz-12"
      >
        {{ description2 }}
      </p>
      <slot />
    </div>
  </b-col>
</template>

<script>
export default {
  name: 'ProductFeedCardReportCard',
  props: {
    status: {
      type: String,
      validator(value) {
        return ['success', 'warning'].indexOf(value) !== -1;
      },
      required: false,
      default: 'success',
    },
    title: {
      type: String,
      required: false,
      default: null,
    },
    subTitle: {
      type: String,
      required: false,
      default: null,
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
    subTitle2: {
      type: String,
      required: false,
      default: null,
    },
    description2: {
      type: String,
      required: false,
      default: null,
    },
    details: {
      type: String,
      required: false,
      default: null,
    },
    link: {
      type: String,
      required: false,
      default: null,
    },
    linkTo: {
      type: Object,
      required: false,
      default: () => null,
    },
    size: {
      type: String,
      required: false,
      default: null,
    },
  },
  methods: {
    goTo(link) {
      this.$router.push({
        name: link.name,
        params: {
          step: link.params,
        },
      });
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', link.step);
    },
  },
};
</script>
