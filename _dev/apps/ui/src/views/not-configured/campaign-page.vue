<template>
  <div>
    <ReportingTableHeader
      :title="0 + ' campaign(s)'"
      :use-date="false"
    />
    <div>
      <b-table-simple
        id="table-filters-performance"
        class="ps_gs-table-products mb-0"
        table-class="border-bottom-0"
        variant="light"
        responsive="xl"
      >
        <b-thead>
          <b-tr class="bg-white">
            <b-th
              v-for="(type) in campaignHeaderList"
              :key="type"
              class="font-weight-600"
            >
              <div class="d-flex align-items-center text-nowrap">
                <span
                  v-if="hasSorting(type)"
                  variant="invisible"
                  class="p-0 border-0"
                >
                  <span>{{ $t(`campaigns.labelCol.${type}`) }}</span>
                  <i class="material-icons ps_gs-fz-14">expand_more</i>
                </span>
                <span v-else>
                  {{ $t(`campaigns.labelCol.${type}`) }}
                </span>
                <span
                  v-if="hasToolTip(type)"
                  variant="invisible"
                  class="p-0 mt-0 ml-1 border-0 d-inline-flex align-items-center"
                >
                  <i class="material-icons ps_gs-fz-14 text-secondary">info_outlined</i>
                </span>
              </div>
            </b-th>
          </b-tr>
          <b-tr>
            <b-th
              v-for="(type) in campaignHeaderList"
              :key="type"
              class="font-weight-600"
            >
              <b-form-input
                v-if="hasInput(type)"
                id="campaign-name-input-filter"
                :placeholder="$t('general.searchByX',
                                 [$t(`campaigns.labelCol.${type}`).toLowerCase()])"
                size="sm"
                class="border-0"
                type="text"
                disabled
              />
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody class="bg-white">
          <b-tr>
            <b-td
              colspan="7"
              class=""
            >
              <div class="d-flex justify-content-center py-4">
                <NotConfiguredCard />
              </div>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
  </div>
</template>

<script>
import NotConfiguredCard from '@/components/commons/not-configured-card';
import ReportingTableHeader from '@/components/campaign/reporting/commons/reporting-table-header.vue';
import CampaignSummaryListHeaderType from '@/enums/campaigns-summary/CampaignSummaryListHeaderType';

export default {
  components: {
    NotConfiguredCard,
    ReportingTableHeader,
  },
  computed: {
    campaignHeaderList() {
      return Object.values(CampaignSummaryListHeaderType);
    },
  },
  methods: {
    hasToolTip(headerType) {
      return headerType === CampaignSummaryListHeaderType.STATUS;
    },
    hasInput(headerType) {
      return headerType === CampaignSummaryListHeaderType.CAMPAIGN;
    },
    hasSorting(headerType) {
      return headerType === CampaignSummaryListHeaderType.DURATION;
    },
  },
};
</script>
