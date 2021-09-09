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
          {{ field.label }}
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
        <b-td>
          <a
            href=""
            target="_blank"
            class=""
          >
            {{ name }}
          </a>
        </b-td>
        <b-td>
          {{ budget }}
        </b-td>
        <b-td>
          {{ status }}
        </b-td>
        <b-td>
          {{ impression }}
        </b-td>
        <b-td>
          {{ clicks }}
        </b-td>
        <b-td>
          {{ adSpent }}
        </b-td>
        <b-td>
          {{ conversion }}
        </b-td>
        <b-td>
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
