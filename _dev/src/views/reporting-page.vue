<template>
  <div id="reporting-page">
    <KeyMetricsBlock />
  </div>
</template>

<script>
import KeyMetricsBlock from '../components/smart-shopping-campaign/reporting/key-metrics/key-metrics-block.vue';

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
