<template>
  <ul class="sync-history list-unstyled mb-auto">
    <slot :syncStates="syncStates" />
  </ul>
</template>

<script>
export default {
  computed: {
  // TODO
  /**
   * Create data structure for the sync history (vertical timeline)
   * An ENUM has been written in _dev/src/enums/product-feed/sync-history.ts
   * Use $t('productFeedPage.syncSummary.syncHistory.title.{$foo}') for the title
   * (with foo being planned | started | failed | completed | next)
   * Use $t('productFeedPage.syncSummary.syncHistory.subtitle.{$foo}', {date}) for the subtitle
   * (with foo being willHappenOnDate | happenedOnDate | error)
   * Icons and line colors are handled with css class:
   * Icons might be: sync-history__item--icon-{foo}
   * (with foo being check | schedule | cancel | change_circle)
   * Line colors might be: sync-history__item--bg-{foo}, the line is to applied on the top
   * (with foo being blue | red)
   */
    syncStates() {
      return [
        {
          title: this.$i18n.t('productFeedPage.syncSummary.syncHistory.title.started'), // This is a mock
          description: this.$i18n.t('productFeedPage.syncSummary.syncHistory.subtitle.happenedOnDate',
            {date: '05/12/21 02:00 AM'}), // This is a mock
          icon: 'check_circle', // This is a mock
          lineColor: 'info', // This is a mock
        },
        {
          title: this.$i18n.t('productFeedPage.syncSummary.syncHistory.title.failed'), // This is a mock
          description: this.$i18n.t('productFeedPage.syncSummary.syncHistory.subtitle.happenedOnDate',
            {date: '05/12/21 02:00 AM'}), // This is a mock
          icon: 'cancel', // This is a mock
        },
      ];
    },
  },
};
</script>
