<template>
  <div id="psxMktgWithGoogleApp">
    <div class="ps_gs-sticky-head">
      <Menu>
        <!-- eslint-disable-next-line -->
        <!-- We display the tab if user has remarketing tag in the module OR already set elsewhere -->
        <template
          v-if="googleAdsChosen
            && (remarketingTagStatus || remarketingTagAlreadyExistsStatus)"
        >
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
    <div
      v-if="shopId"
      id="helper-shopid"
    >
      {{ shopId }}
    </div>
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
    remarketingTagStatus() {
      return this.$store.getters['smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_IS_SET'];
    },
    remarketingTagAlreadyExistsStatus() {
      return this.$store.getters['smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_ALREADY_EXIST_STATUS'];
    },
    shopId() {
      return window.shopIdPsAccounts;
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

<style>
  #helper-shopid {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 10000;
    color: white;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    transition: all .3s;
  }

  #helper-shopid:hover {
    text-shadow: 0 0 8px rgba(0, 0, 0, 1);
  }
</style>
