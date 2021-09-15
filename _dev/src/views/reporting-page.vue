<template>
  <div id="reporting-page">
    <KeyMetricsBlock />
  </div>
</template>

<script>
import KeyMetricsBlock from '../components/smart-shopping-campaign/reporting/key-metrics/key-metrics-block.vue';
import DailyResultType from '../enums/DailyResultType';
import QueryOrderDirection from '../enums/QueryOrderDirection';

export default {
  components: {
    KeyMetricsBlock,
  },
  computed: {
    remarketingTagIsSetted() {
      return this.$store.getters['smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_IS_SETTED'];
    },
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE');
      await this.$store.dispatch('smartShoppingCampaigns/GET_REPORTING_METRICS_KPIS');
      await this.$store.dispatch('smartShoppingCampaigns/GET_REPORTING_METRICS_DAILY_RESULTS', DailyResultType.IMPRESSIONS);
      await this.$store.dispatch('smartShoppingCampaigns/GET_REPORTING_METRICS_CAMPAIGNS_PERFORMANCES', QueryOrderDirection.DESCENDING);
      await this.$store.dispatch('smartShoppingCampaigns/GET_REPORTING_METRICS_PRODUCTS_PERFORMANCES', QueryOrderDirection.DESCENDING);
      await this.$store.dispatch('smartShoppingCampaigns/GET_REPORTING_METRICS_PRODUCTS_PARTITIONS_PERFORMANCES', QueryOrderDirection.DESCENDING);
    },
  },
  mounted() {
    this.getDatas()
      .then(() => {
        if (!this.remarketingTagIsSetted) {
          this.$router.push({
            name: 'onboarding',
          });
        }
      });
  },
};
</script>
