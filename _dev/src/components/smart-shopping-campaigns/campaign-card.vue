<template>
  <b-card no-body>
    <div class="ps_gs-landingpage ps_gs-landingpage--small-padding">
      <h3 class="ps_gs-landingpage-content__title mb-3">
        {{ $t('campaignCard.title') }}
      </h3>
      <div
        class="ps_gs-landingpage-content d-flex flex-column flex-md-row align-items-center"
      >
        <figure class="ps_gs-landingpage-content__figure flex-shrink-0 mr-md-3">
          <img
            :src="require(`@/assets/images/Google-Commercial-img.png`)"
            class="img-fluid d-block mx-auto"
            alt=""
          >
        </figure>
        <div>
          <VueShowdown
            :markdown="$t('campaignCard.description')"
            class="ps_gs-fz-16"
          />
        </div>
      </div>
      <div
        class="ps_gs-fz-12 text-muted d-flex flex-wrap flex-md-nowrap justify-content-between mt-3"
      >
        <p class="mb-0">
          {{ $t('campaignCard.footer') }}
        </p>
        <div class="flex-grow-1 d-flex-md flex-md-grow-0 flex-shrink-0 text-center">
          <b-button
            @click="openPopinActivateTracking"
            variant="primary"
            size="sm"
            class="mx-1 mt-3 mt-md-0 mr-md-0 ml-md-3"
          >
            {{ $t('cta.createSmartShoppingCampaign') }}
          </b-button>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>

export default {
  name: 'Campaign',
  computed: {
    trackingStatus() {
      return this.$store.state.smartShoppingCampaigns.tracking;
    },
    SSCExist() {
      const campaigns = this.$store.getters['smartShoppingCampaigns/GET_ALL_SSC'];
      if (campaigns.length) {
        return true;
      }
      return false;
    },
  },
  methods: {
    openPopinActivateTracking() {
      if (this.SSCExist) {
        this.$router.push({
          name: 'campaign-creation',
        });
      } else {
        this.$emit('openPopin');
      }
    },
  },
};
</script>
