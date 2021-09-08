<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard"
  >
    <b-card-header
      header-tag="nav"
      header-class="px-3 py-1"
    >
      12 campaigns
    </b-card-header>
    <b-card-body body-class="py-3 mt-2">
      <b-table-simple
        id="table-reporting"
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

        <b-tbody>
          <tr>
            <td class="ps_gs-fz-12">
              <a href="//google.com">Promotion</a>
            </td>
            <td class="ps_gs-fz-12 text-nowrap">
              2021/03/01 - 2021/05/31
            </td>
            <td class="ps_gs-fz-12">
              Pending
            </td>
            <td class="ps_gs-fz-12">
              France
            </td>
            <td class="ps_gs-fz-12">
              All synced products
            </td>
            <td class="ps_gs-fz-12">
              $125
            </td>
            <td class="ps_gs-fz-12 text-right">
              <b-dropdown
                variant="invisible"
                no-caret
                id="actions-menu-campaign-XXX"
              >
                <template #button-content>
                 <i class="material-icons ps_gs-fz-24 text-grey_darklight">more_vert</i>
                 <span class="sr-only">Open actions menu for campaign XXX</span>
                </template>
                <b-dropdown-item>
                  Modify the campaign
                </b-dropdown-item>
                <b-dropdown-item>
                  Pause the campaign
                </b-dropdown-item>
                <b-dropdown-item>
                  End the campaign
                </b-dropdown-item>
                <b-dropdown-item>
                  View in GMC
                </b-dropdown-item>
              </b-dropdown>
            </td>
          </tr>
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
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: 'SmartShoppingCampaignTableList',
  data() {
    return {
      loading: false,
      items: [],
            fields: [
        {
          key: 'name',
          label: 'Campaign',
        },
        {
          key: 'duration',
          label: 'Duration date',
        },
        {
          key: 'status',
          label: 'Status',
        },
        {
          key: 'target',
          label: 'Target',
        },
        {
          key: 'products',
          label: 'Products',
        },
        {
          key: 'budget',
          label: 'Daily budget',
        },
        {
          key: 'actions',
          label: 'Actions',
        },
      ],
    }
  },
}
</script>
