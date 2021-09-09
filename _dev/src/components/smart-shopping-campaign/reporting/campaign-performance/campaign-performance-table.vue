<template>
  <b-table-simple
    id="table-campaign-performance"
    class="ps_gs-table-products mb-3"
    :table-class="{'border-bottom-0': loading}"
    variant="light"
    responsive="xl"
  >
    <b-thead>
      <b-tr>
        <b-th
          v-for="(field, index) in fields"
          :key="index"
          :class="{'b-table-sticky-column': index === 0}"
        >
        <div class="flex align-items-center">
          {{ field.label }}
          <b-button
            v-if="field.tooltip"
            variant="invisible py-0 pr-0 pl-1 m-0 mt-n1 border-0"
            v-b-tooltip:psxMktgWithGoogleApp
            :title="field.tooltip"
          >
            <i class="material-icons ps_gs-fz-14 text-secondary">error_outline</i>
          </b-button>
        </div>
        </b-th>
      </b-tr>
    </b-thead>

    <b-tbody class="bg-white">
      <b-tr
        v-for="{
          name,
          budget,
          status,
          impression,
          clicks,
          adSpent,
          conversion,
          sales,
        } in campaigns"
        :key="name"
      >
        <b-td
          class="ps_gs-fs-12 text-primary"
        >
          <a
            href="//google.com/placeholder"
            target="_blank"
            class="external_link-no_icon"
          >
            {{ name }}
          </a>
        </b-td>
        <b-td class="ps_gs-fs-12">
          {{ budget }}
        </b-td>
        <b-td class="ps_gs-fs-12">
          {{ status }}
        </b-td>
        <b-td class="ps_gs-fs-12">
          {{ impression }}
        </b-td>
        <b-td class="ps_gs-fs-12">
          {{ clicks }}
        </b-td>
        <b-td class="ps_gs-fs-12">
          {{ adSpent }}
        </b-td>
        <b-td class="ps_gs-fs-12">
          {{ conversion }}
        </b-td>
        <b-td class="ps_gs-fs-12">
          {{ sales }}
        </b-td>
      </b-tr>
      <b-tr v-if="loading">
        <b-td
          colspan="7"
          class="ps_gs-table-products__loading-slot"
        >
          <i class="ps_gs-table-products__spinner">loading</i>
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
export default {
  name: 'CampaignPerformanceTable',
  data() {
    return {
      loading: false,
      fields: [
        {
          label: 'Campaign',
        },
        {
          label: 'Budget',
        },
        {
          label: 'Status',
          tooltip: 'lorem ipsum placeholder'
        },
        {
          label: 'Impression',
        },
        {
          label: 'Clicks',
        },
        {
          label: 'Ad spend',
        },
        {
          label: 'Conversion',
        },
        {
          label: 'Sales',
        },
      ],
      campaigns: [
        {
          name: 'Promotion',
          budget: '$125',
          status: 'Eligible',
          impression: '178998',
          clicks: '178998',
          adSpent: '$125',
          conversion: '178',
          sales: '$178000',
        },
      ],
    };
  },
}
</script>
