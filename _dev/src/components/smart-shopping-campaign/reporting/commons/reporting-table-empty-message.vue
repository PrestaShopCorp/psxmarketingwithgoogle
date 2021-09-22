<template>
  <tr>
    <td
      :colspan="colspan"
      class="text-center py-3 ps_gs-fz-12"
    >
      <p class="mb-0 text-muted">
        {{ $t(text) }}
      </p>
      <b-button
        variant="link"
        class="py-0 font-weight-normal ps_gs-fz-12"
        @click="createCampaign"
      >
        {{ $t('cta.createCampaign') }}
      </b-button>
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
      required: false,
      default: 'campaigns.emptyListText',
    },
  },
  methods: {
    createCampaign() {
      this.$router.push({
        name: 'campaign-creation',
      });
    },
  },
};
</script>
