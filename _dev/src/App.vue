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
    <b-alert
      v-else-if="error"
      show
      variant="warning"
      class="mb-0 mt-2"
    >
      <span class="ml-2"> {{ $t('mcaCard.alertSomethingHappened') }}</span>
    </b-alert>
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
        <div class="mb-2">
      <b-alert
        v-if="!eventbusIsOK"
        variant="warning"
        class="mb-0 mt-3"
        show
      >
        <VueShowdown
          tag="p"
          :extensions="['no-p-tag']"
          class="mb-0"
          :markdown="$t('general.eventBusMustbeUpdated')"
        />
        <div
          class="d-md-flex text-center align-items-center mt-2"
        >
          <b-button
            size="sm"
            class="mx-1 mt-3 mt-md-0 md-4 mr-md-1"
            variant="primary"
            target="_blank"
            @click="moduleUpdated(eventBusVersion)"
          >
            <span v-if="loading">
              <span class="icon-busy icon-busy--dark" />
            </span>
            <span
              v-else
            >
              {{ $t('cta.update') }}
            </span>
          </b-button>
        </div>
      </b-alert>
      <b-alert
        v-else-if="!psxmarketingwithgoogleIsOk"
        variant="warning"
        class="mb-0 mt-3"
        show
      >
        <VueShowdown
          tag="p"
          :extensions="['no-p-tag']"
          class="mb-0"
          :markdown="$t('general.psxmarketingwithgoogleMustBedUpdated')"
        />
        <div
          class="d-md-flex text-center align-items-center mt-2"
        >
          <b-button
            size="sm"
            class="mx-1 mt-3 mt-md-0 md-4 mr-md-1"
            variant="primary"
            target="_blank"
            @click="moduleUpdated(psxmarketingwithgoogleVersion)"
          >
            <span v-if="loading">
              <span class="icon-busy icon-busy--dark" />
            </span>
            <span
              v-else
            >
              {{ $t('cta.update') }}
            </span>
          </b-button>
        </div>
      </b-alert>
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
import SegmentGenericParams from '@/utils/SegmentGenericParams';

let resizeEventTimer;
const root = document.documentElement;
const header = document.querySelector('#content .page-head');
const headerFull = document.querySelector('#header_infos');
const semver = require('semver');

export default {
  name: 'Home',
  components: {
    Menu,
    MenuItem,
  },
  data() {
    return {
      error: false,
      loading: false,
      eventbusIsOK: true,
      psxmarketingwithgoogleIsOk: true,
      eventBusVersion: {
        name: 'ps_eventbus',
        version: '',
        upgradeLink: null,
      },
      psxmarketingwithgoogleVersion: {
        name: 'psxmarketingwithgoogle',
        version: '',
        upgradeLink: null,
      },
    };
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
    this.checkForModuleVersion(this.eventBusVersion);
    this.checkForModuleVersion(this.psxmarketingwithgoogleVersion);
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
    checkForModuleVersion(moduleChosen) {
      console.log('coucou');
      this.$store.dispatch('app/GET_MODULES_VERSIONS', moduleChosen.name).then((res) => {
        if (!res.version){
           this.error= true;
           return
        }
        if (moduleChosen.name === 'ps_eventbus') {
          console.log(res.version);
          console.log(this.$store.state.app.eventbusVersionNeeded);
          // if module version >= version wanted
          if (semver.gte(res.version, this.$store.state.app.eventbusVersionNeeded)) {
            return;
          }
          this.eventbusIsOK = false;
          this.eventBusVersion.upgradeLink = res.upgradeLink;
        } else {
          console.log(res.version);
          console.log(this.$store.state.app.psxMktgWithGoogleModuleVersionNeeded);
          // if module version >= version wanted
          if (semver.gte(res.version, this.$store.state.app.psxMktgWithGoogleModuleVersionNeeded)) {
            return;
          }
          this.psxmarketingwithgoogleIsOk = false;
          this.psxmarketingwithgoogleVersion.upgradeLink = res.upgradeLink;
        }
      });
    },
    async moduleUpdated(moduleChosen) {
      this.loading = true;
      await fetch(moduleChosen.upgradeLink, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      });

      if (moduleChosen.name === 'ps_eventbus') {
        this.eventbusIsOK = true;
        this.checkForModuleVersion(this.eventBusVersion);
      } else {
        this.psxmarketingwithgoogleIsOk = true;
        this.checkForModuleVersion(this.psxmarketingwithgoogleVersion);
      }
      this.loading = false;
    },
  },
  watch: {
    $route() {
      this.$root.identifySegment();
    },
  },
};
</script>
