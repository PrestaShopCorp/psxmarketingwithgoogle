<template>
  <div>
    <ReportingTableHeader
      :title="$t('productsPerformanceTable.title')"
      :subtitle="$t('productsPerformanceTable.subTitle')"
      startDate="04/06/2021"
      endDate="04/07/2021"
    />
    <b-table-simple
      id="table-products-performance"
      class="ps_gs-table-products mb-3"
      :table-class="{'border-bottom-0': loading}"
      variant="light"
      responsive="xl"
    >
      <b-thead>
        <b-tr>
          <b-th
            v-for="({label, tooltip}, index) in fields"
            :key="label"
            class="font-weight-600"
            :class="{'b-table-sticky-column b-table-sticky-column--invisible': index === 1}"
          >
          <div class="flex align-items-center text-nowrap">
            <span>{{ $t(`productsPerformanceTable.label${label}`) }}</span>
            <b-button
              v-if="tooltip"
              variant="invisible"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="field.tooltip"
              class="p-0 mt-0 ml-1 border-0 d-inline-flex align-items-center"
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
            id,
            attribute,
            product,
            click,
            costs,
            averageCpc,
            conversions,
            conversionsRate,
            sales
          } in campaigns"
          :key="id + attribute"
        >
          <b-td
            class="ps_gs-fz-12"
          >
            {{ id }}{{ attribute > 0 ? '&#8209;' + attribute : '' }}
          </b-td>
          <b-td
            class="b-table-sticky-column text-primary"
          >
            <a
              href=""
              target="_blank"
              class="external_link-no_icon"
            >
              {{ product }}
            </a>
          </b-td>
          <b-td
            class="ps_gs-fz-12"
          >
            {{ click }}
          </b-td>
          <b-td class="ps_gs-fz-12">
            {{ costs }}
          </b-td>
          <b-td class="ps_gs-fz-12">
            {{ averageCpc }}
          </b-td>
          <b-td class="ps_gs-fz-12">
            {{ conversions }}
          </b-td>
          <b-td class="ps_gs-fz-12">
            {{ conversionsRate }}
          </b-td>
          <b-td class="ps_gs-fz-12">
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
  </div>
</template>

<script>
import ReportingTableHeader from '../commons/reporting-table-header.vue';

export default {
  name: 'CampaignsPerformanceTable',
  components: {
    ReportingTableHeader,
  },
  data() {
    return {
      loading: false,
      fields: [
        {
          label: 'ID',
        },
        {
          label: 'Product',
        },
        {
          label: 'Click',
        },
        {
          label: 'Costs',
        },
        {
          label: 'AverageCPC',
        },
        {
          label: 'Conversions',
        },
        {
          label: 'ConversionsRate',
        },
        {
          label: 'Sales',
        },
      ],
      // TODO
      // Adds real datas
      campaigns: [
        {
          id : '05',
          attribute: '01',
          product : 'T-shirt summer',
          click : '3678',
          costs : '$125',
          averageCpc : '$2',
          conversions : '5584',
          conversionsRate : '2%',
          sales : '$3182',
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      // Observer to add class to sticky columns when they are stuck
      document.querySelectorAll('.b-table-sticky-column').forEach((i) => {
        if (i) {
          const observer = new IntersectionObserver(
            (entries) => {
              observerCallback(entries, observer, i);
            },
            {
              root: document.querySelector('.ps_gs-table-products'),
              threshold: 1,
            },
          );
          observer.observe(i);
        }
      });
      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-pinned', entry.intersectionRatio < 1);
        });
      };
    });
  },
}
</script>
