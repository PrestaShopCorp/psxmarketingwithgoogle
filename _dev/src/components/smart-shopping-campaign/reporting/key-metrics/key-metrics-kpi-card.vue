<template>
  <b-col
    cols="12"
    sm="6"
    md="4"
    xl="2"
    class="py-1 d-flex flex-column"
  >
    <b-card
      class="ps_gs-kpi-card flex-grow-1"
      body-class="p-3"
    >
      <b-button
        v-if="tooltip"
        variant="invisible"
        class="ps_gs-kpi-card__tooltip"
        v-b-tooltip:psxMktgWithGoogleApp
        :title="tooltip"
      >
        <i class="material-icons ps_gs-fz-14 text-secondary">error_outline</i>
        <span class="sr-only">
          {{ $t('cta.moreInfosAboutX', [kpi]) }}
        </span>
      </b-button>
      <dl class="mb-0">
        <dt
          class="ps_gs-fz-18 font-weight-bold"
        >
          {{ value }}
        </dt>
        <dd class="mb-0">
          {{ kpi }}
        </dd>
      </dl>
    </b-card>
  </b-col>
</template>

<script>
export default {
  name: 'KeyMetricsKpiCard',
  props: {
    value: {
      type: String,
      required: true,
    },
    kpi: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: false,
    },
  },
};
</script>
