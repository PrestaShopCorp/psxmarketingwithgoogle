<template>
  <tr>
    <td
      :colspan="colspan"
      class="text-center"
    >
      <div
        class="py-3 text-center ps_gs-fz-12"
      >
        <p class="pt-2 mb-0 text-muted">
          {{ $t(text) }}
        </p>
        <b-button
          v-if="cta"
          variant="link"
          class="py-2 font-weight-normal ps_gs-fz-12 text-decoration-underline"
          @click="cta"
        >
          {{ $t('cta.createCampaign') }}
        </b-button>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'ReportingTableEmptyMessage',
  props: {
    colspan: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    cta: {
      type: Function,
      required: false,
      default: null,
    },
  },
};
</script>
