<template>
  <div id="psxMktgWithGoogleApp">
    <template v-if="adBlockerExist">
      <b-card
        no-body
        class="ps_gs-onboardingcard px-0"
      >
        <b-card-header
          header-tag="h3"
          header-class="px-3 py-3 font-weight-600 ps_gs-fz-16 mb-0"
        >
          {{ $t('general.adblockerActivated') }}
        </b-card-header>
      </b-card>
    </template>
    <template v-else>
      <div class="ps_gs-sticky-head">
        <Menu>
          <!-- eslint-disable-next-line -->
        <!-- We display the tab if user has remarketing tag in the module OR already set elsewhere -->
          <template
            v-if="googleAdsChosen
              && remarketingTag"
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
    </template>
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
    remarketingTag() {
      return this.$store.getters['smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_STATUS'];
    },
    shopId() {
      return window.shopIdPsAccounts;
    },
    adBlockerExist() {
      return this.$store.getters['app/GET_ADD_BLOCKER_STATUS'];
    },
  },
  created() {
    this.$root.identifySegment();
    this.$store.dispatch('app/CHECK_FOR_AD_BLOCKER');
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
