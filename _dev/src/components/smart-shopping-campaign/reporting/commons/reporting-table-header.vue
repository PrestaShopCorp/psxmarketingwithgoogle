<template>
  <div
    class="ps_gs-table-reporting-header rounded-top px-3 py-2
      d-md-flex align-items-end bg-light mt-4"
  >
    <h3 class="ps_gs-fz-16 mb-0 mr-2 font-weight-600">
      {{ title }}
    </h3>
    <p
      v-if="subtitle"
      class="ps_gs-fz-10 mb-0 mr-auto"
    >
      {{ subtitle }}
    </p>
    <p
      v-if="startDate !== null & endDate !== null"
      class="ps_gs-fz-10 mb-0 text-sm-right"
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
    startDate: {
      type: String,
      required: false,
      default: null,
    },
    endDate: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>
