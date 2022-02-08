<template>
  <ul class="sync-history list-unstyled mb-auto">
    <slot :syncStates="syncStates" />
  </ul>
</template>

<script>
export default {
  computed: {
    syncStatus() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'];
    },
    syncStates() {
      if (!this.syncStatus.success && !this.syncStatus.nextJobAt) {
        //  sync in progress
        return [
          {
            title: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.title.started',
            ),
            description: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.subtitle.happenedOnDate',
              {date: this.$options.filters.timeConverterToDate(this.syncStatus.lastUpdatedAt)},
            ),
            icon: 'schedule',
          },
        ];
      }
      if (
        !this.syncStatus.success
        && this.syncStatus.nextJobAt
        && !this.syncStatus.jobEndedAt
      ) {
        //  sync planned
        return [
          {
            title: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.title.planned',
            ),
            description: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.subtitle.willHappenOnDate',
              {date: this.$options.filters.timeConverterToDate(this.syncStatus.nextJobAt)},
            ),
            icon: 'change_circle',
          },
        ];
      }
      if (!this.syncStatus.success && this.syncStatus.jobEndedAt) {
        //  sync failed
        return [
          {
            title: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.title.started',
            ),
            description: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.subtitle.happenedOnDate',
              {date: this.$options.filters.timeConverterToDate(this.syncStatus.lastUpdatedAt)},
            ),
            icon: 'check_circle',
            lineColor: 'danger',
          },
          {
            title: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.title.failed',
            ),
            description: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.subtitle.error',
              {date: this.$options.filters.timeConverterToDate(this.syncStatus.jobEndedAt)},
            ),
            icon: 'cancel',
          },

        ];
      }
      // sync success
      return [
        {
          title: this.$i18n.t(
            'productFeedPage.syncSummary.syncHistory.title.started',
          ),
          description: this.$i18n.t(
            'productFeedPage.syncSummary.syncHistory.subtitle.happenedOnDate',
            {date: this.$options.filters.timeConverterToDate(this.syncStatus.lastUpdatedAt)},
          ),
          icon: 'check_circle',
          lineColor: 'info',
        },
        {
          title: this.$i18n.t(
            'productFeedPage.syncSummary.syncHistory.title.completed',
          ),
          description: this.$i18n.t(
            'productFeedPage.syncSummary.syncHistory.subtitle.happenedOnDate',
            {date: this.$options.filters.timeConverterToDate(this.syncStatus.jobEndedAt)},
          ),
          icon: 'check_circle',
          lineColor: 'info',

        },
        {
          title: this.$i18n.t(
            'productFeedPage.syncSummary.syncHistory.title.next',
          ),
          description: this.$i18n.t(
            'productFeedPage.syncSummary.syncHistory.subtitle.willHappenOnDate',
            {date: this.$options.filters.timeConverterToDate(this.syncStatus.nextJobAt)},
          ),
          icon: 'schedule',
        },
      ];
    },
  },
};
</script>
