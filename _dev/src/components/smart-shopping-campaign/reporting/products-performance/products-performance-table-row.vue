<template>
  <b-tr>
    <b-td
      class="ps_gs-fz-12"
    >
      {{ campaign.id }}{{ campaign.attribute > 0 ? '&#8209;' + campaign.attribute : '' }}
    </b-td>
    <b-td
      class="b-table-sticky-column text-primary"
    >
      <a
        href=""
        target="_blank"
        class="external_link-no_icon"
      >
        {{ campaign.name }}
      </a>
    </b-td>
    <b-td
      class="ps_gs-fz-12"
    >
      {{ campaign.clicks }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.costs }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.averageCostPerClick }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.conversions }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.conversionsRate }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.sales }}
    </b-td>
  </b-tr>
</template>

<script>
export default {
  name: 'ProductsPerformanceTableRow',
  props: {
    campaign: {
      type: Object,
      required: true,
    },
  },
};
</script>
