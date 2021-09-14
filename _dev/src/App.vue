<template>
  <div id="psxMktgWithGoogleApp">
    <div class="ps_gs-sticky-head">
      <Menu>
        <template v-if="remarketingTagIsSetted">
          <MenuItem
            :route="{name: 'reporting'}"
          >
            {{ $t('general.tabs.reporting') }}
          </MenuItem>
        </template>
        <template v-if="productFeedIsConfigured">
          <MenuItem
            :route="{name: 'product-feed'}"
          >
            {{ $t('general.tabs.productFeed') }}
          </MenuItem>
          <MenuItem
            v-if="googleAdsChosen"
            :route="{name: 'campaign'}"
          >
            {{ $t('general.tabs.campaign') }}
          </MenuItem>
        </template>
        <MenuItem
          :route="{name: 'configuration'}"
        >
          {{ $t('general.tabs.configuration') }}
        </MenuItem>
        <MenuItem
          :route="{name: 'help'}"
        >
          {{ $t('general.tabs.help') }}
        </MenuItem>
      </Menu>
      <b-toaster
        name="b-toaster-top-right"
        class="ps_gs-toaster-top-right"
      />
    </div>
    <router-view />
  </div>
</template>

<script>
import Menu from '@/components/menu/menu.vue';
import MenuItem from '@/components/menu/menu-item.vue';

export default {
  name: 'Home',
  components: {
    Menu,
    MenuItem,
  },
  computed: {
    productFeedIsConfigured() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED'];
    },
    googleAdsChosen() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']
      && this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'].billingSettings.isSet;
    },
    remarketingTagIsSetted() {
      return this.$store.getters['smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_IS_SETTED'];
    },
  },
  created() {
    this.$root.identifySegment();
  },
  watch: {
    $route() {
      this.$root.identifySegment();
    },
  },
};
</script>
