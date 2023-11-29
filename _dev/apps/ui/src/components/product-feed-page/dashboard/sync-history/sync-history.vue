<template>
  <ul class="sync-history list-unstyled mb-auto">
    <slot :sync-states="syncStates" />
  </ul>
</template>

<script>
import {
  SyncHystoryType,
} from '@/enums/product-feed/sync-history.ts';

export default {
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
    syncInfos() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'];
    },
    syncStates() {
      if (this.inNeedOfConfiguration) {
        return [
          {
            title: this.$i18n.t('productFeedPage.syncSummary.syncHistory.title.notPlanned'), // This is a mock
            icon: 'info', // This is a mock
          },
        ];
      }
      if (this.syncStatus === SyncHystoryType.SCHEDULE) {
        return [
          {
            title: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.title.started',
            ),
            description: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.subtitle.happenedOnDate',
              {date: this.$options.filters.timeConverterToDate(this.syncInfos.lastUpdatedAt)},
            ),
            icon: 'change_circle',
          },
        ];
      }
      if (
        this.syncStatus === SyncHystoryType.PLANNED
      ) {
        return [
          {
            title: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.title.planned',
            ),
            description: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.subtitle.willHappenOnDate', [
                this.$options.filters.timeConverterToDate(this.syncInfos.nextJobAt),
                this.$options.filters.timeConverterToHour(this.syncInfos.nextJobAt),
              ]),
            icon: 'schedule',
          },
        ];
      }
      if (this.syncStatus === SyncHystoryType.FAILED) {
        return [
          {
            title: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.title.started',
            ),
            description: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.subtitle.happenedOnDate',
              {
                date: this.$options.filters.timeConverterToDate(
                  this.syncInfos.lastUpdatedAt ?? this.syncInfos.jobEndedAt,
                ),
              },
            ),
            icon: 'check_circle',
            lineColor: 'info',
          },
          {
            title: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.title.failed',
            ),
            description: this.$i18n.t(
              'productFeedPage.syncSummary.syncHistory.subtitle.error', [
                this.$options.filters.timeConverterToDate(this.syncInfos.lastUpdatedAt
                ?? this.syncInfos.jobEndedAt),
                this.$options.filters.timeConverterToHour(this.syncInfos.lastUpdatedAt
                ?? this.syncInfos.jobEndedAt),
              ],
            ),
            icon: 'error',
            lineColor: 'danger',
          },

        ];
      }
      // Case success
      return [
        {
          title: this.$i18n.t(
            'productFeedPage.syncSummary.syncHistory.title.started',
          ),
          description: this.$i18n.t(
            'productFeedPage.syncSummary.syncHistory.subtitle.happenedOnDate',
            {date: this.$options.filters.timeConverterToDate(this.syncInfos.lastUpdatedAt)},
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
            {date: this.$options.filters.timeConverterToDate(this.syncInfos.jobEndedAt)},
          ),
          icon: 'check_circle',
          lineColor: 'info',
        },
        {
          title: this.$i18n.t(
            'productFeedPage.syncSummary.syncHistory.title.next',
          ),
          description: this.$i18n.t(
            'productFeedPage.syncSummary.syncHistory.subtitle.willHappenOnDate', [
              this.$options.filters.timeConverterToDate(this.syncInfos.nextJobAt),
              this.$options.filters.timeConverterToHour(this.syncInfos.nextJobAt),
            ],

          ),
          icon: 'schedule',
        },
      ];
    },
  },
};
</script>
