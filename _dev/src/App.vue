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
          <template v-if="reportingTabVisible">
            <MenuItem
              @click.native="throwSegmentEvent"
              :route="{name: 'reporting'}"
            >
              {{ $t('general.tabs.reporting') }}
            </MenuItem>
          </template>
          <template v-if="productFeedIsConfigured">
            <MenuItem
              :route="{name: 'product-feed'}"
            >
              {{ $t('general.tabs.exportStatus') }}
            </MenuItem>
            <MenuItem
              v-if="googleAdsServing"
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
      <AlertModuleUpdate
        module-name="ps_eventbus"
        :needed-version="this.$store.state.app.eventbusVersionNeeded"
      />
      <AlertModuleUpdate
        module-name="psxmarketingwithgoogle"
        :needed-version="this.$store.state.app.psxMktgWithGoogleModuleVersionNeeded"
      />
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
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import AlertModuleUpdate from '@/components/commons/alert-update-module';

let resizeEventTimer;
const root = document.documentElement;
const header = document.querySelector('#content .page-head');
const headerFull = document.querySelector('#header_infos');

export default {
  name: 'Home',
  components: {
    Menu,
    MenuItem,
    AlertModuleUpdate,
  },

  computed: {
    productFeedIsConfigured() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED'];
    },
    googleAdsServing() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_IS_SERVING'];
    },
    remarketingTag() {
      return this.$store.getters['smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_STATUS'];
    },
    reportingTabVisible() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_TAB_IS_ACTIVE'];
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
    this.setCustomProperties();
    window.addEventListener('resize', this.resizeEventHandler);
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEventHandler);
  },
  methods: {
    resizeEventHandler() {
      clearTimeout(resizeEventTimer);
      resizeEventTimer = setTimeout(() => {
        this.setCustomProperties();
      }, 250);
    },
    setCustomProperties() {
      root.style.setProperty('--header-height', `${header.clientHeight}px`);
      root.style.setProperty('--header-height-full', `${header.clientHeight + headerFull.clientHeight}px`);
    },
    throwSegmentEvent() {
      this.$segment.track('[GGL] Clicked on reporting tab', {
        module: 'psxmarketingwithgoogle',
        userId: this.$store.state.accounts.shopIdPsAccounts,
        traits: {
          email: this.$store.state.accounts.contextPsAccounts.user.email,
          psx_pg_report_last_activity: new Date(),
        },
        params: SegmentGenericParams,
      });
    },

  },
  watch: {
    $route() {
      this.$root.identifySegment();
    },
  },
};
</script>
