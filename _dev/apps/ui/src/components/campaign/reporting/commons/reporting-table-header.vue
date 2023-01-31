<template>
  <div
    class="ps_gs-table-reporting-header rounded-top px-3 py-2
      d-md-flex align-items-end bg-light mt-4"
  >
    <h3 class="mb-0 mr-2 ps_gs-fz-16 font-weight-600 flex-shrink-0 align-self-start">
      {{ title }}
    </h3>
    <VueShowdown
      v-if="subtitle"
      class="mb-0 mr-auto ps_gs-fz-10"
      :markdown="subtitle"
      :extensions="['extended-link']"
    />
    <p
      v-if="useDate"
      class="mb-0 ps_gs-fz-10 text-sm-right"
    >
      {{ $t('campaigns.fromXToX',
            {
              startDate,
              endDate
            }
      ) }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'ReportingTableHeader',
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
    useDate: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    startDate() {
      return this.$store.getters['campaigns/GET_REPORTING_FORMATTED_START_DATES'];
    },
    endDate() {
      return this.$store.getters['campaigns/GET_REPORTING_FORMATTED_END_DATES'];
    },
  },
};
</script>
