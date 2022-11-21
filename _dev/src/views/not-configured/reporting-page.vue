<template>
  <div id="reporting-page">
    <b-card
      header-class="px-3 d-sm-flex justify-content-between align-items-center"
      body-class="p-3"
    >
      <template #header>
        <p class="flex-shrink-0 mb-2 ps_gs-onboardingcard__title mb-sm-0">
          {{ $t('keymetrics.title') }}
        </p>

        <div>
          <b-form-group
            class="mb-0 d-none d-sm-block"
          >
            <b-form-radio-group
              buttons
              button-variant="outline-primary rounded-0"
              size="sm"
              v-model="reportingPeriod"
              :options="periods"
              disabled
            />
          </b-form-group>
          <b-dropdown
            id="periodSelectorMobile"
            :text="$t(`keymetrics.periods.${reportingPeriod}`)"
            variant=" "
            class="mb-2 ps-dropdown psxmarketingwithgoogle-dropdown bordered maxw-sm-250 d-sm-none"
            size="sm"
            menu-class="ps-dropdown"
          >
            <b-dropdown-item
              v-for="{value, text} in periods"
              :key="value"
              link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
              disabled
            >
              {{ text }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </template>
      <div class="d-flex justify-content-center py-4">
        <NotConfiguredCard />
      </div>
    </b-card>
  </div>
</template>

<script>
import NotConfiguredCard from '@/components/commons/not-configured-card';
import ReportingPeriod from '@/enums/reporting/ReportingPeriod';

export default {
  data() {
    return {
      reportingPeriod: ReportingPeriod.LAST_THIRTY_DAY,
      periods: [
        {
          value: ReportingPeriod.YESTERDAY,
          text: this.$i18n.t(`keymetrics.periods.${ReportingPeriod.YESTERDAY}`),
        },
        {
          value: ReportingPeriod.LAST_SEVEN_DAYS,
          text: this.$i18n.t(`keymetrics.periods.${ReportingPeriod.LAST_SEVEN_DAYS}`),
        },
        {
          value: ReportingPeriod.LAST_THIRTY_DAY,
          text: this.$i18n.t(`keymetrics.periods.${ReportingPeriod.LAST_THIRTY_DAY}`),
        },
        {
          value: ReportingPeriod.THREE_MONTH,
          text: this.$i18n.t(`keymetrics.periods.${ReportingPeriod.THREE_MONTH}`),
        },
      ],
    };
  },
  components: {
    NotConfiguredCard,
  },
};
</script>
