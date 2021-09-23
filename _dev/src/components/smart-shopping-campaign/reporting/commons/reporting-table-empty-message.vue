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
          variant="link"
          class="py-2 font-weight-normal ps_gs-fz-12 text-decoration-underline"
          @click="createCampaign"
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
