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
      <div
        id="head_tabs"
        class="ps_gs-sticky-head"
      >
        <AppMenu>
          <MenuItem
            v-if="!currentlyOnLandingPage && GET_BILLING_SUBSCRIPTION_ACTIVE"
            :route="{name: 'campaign'}"
          >
            {{ $t('general.tabs.campaign') }}
          </MenuItem>
          <MenuItem
            v-if="!currentlyOnLandingPage && GET_BILLING_SUBSCRIPTION_ACTIVE"
            :route="{name: 'product-feed'}"
          >
            {{ $t('general.tabs.productFeed') }}
          </MenuItem>
          <MenuItem
            :route="{name: 'configuration'}"
          >
            {{ $t('general.tabs.configuration') }}
          </MenuItem>
          <MenuItem
            :route="{name: 'Billing'}"
            v-if="GET_BILLING_SUBSCRIPTION_ACTIVE"
          >
            {{ $t('general.tabs.billing') }}
          </MenuItem>
          <MenuItem
            :route="{name: 'help'}"
          >
            {{ $t('general.tabs.help') }}
          </MenuItem>
        </AppMenu>
        <b-toaster
          name="b-toaster-top-right"
          class="ps_gs-toaster-top-right"
        />
      </div>
      <notification-panel />
      <div class="container">
        <AlertModuleUpdate
          v-if="modulePsEventbusNeedUpgrade"
          module-name="ps_eventbus"
        />
      </div>
      <router-view />
      <div
        class="ps_gs-landingpage-content__muted text-muted bg-transparent mt-4"
        v-if="currentlyOnLandingPage"
      >
        <VueShowdown
          :markdown="$t('landingPage.footer.explanation')"
          :extensions="['extended-link']"
        />
      </div>
      <div
        v-if="shopId"
        id="helper-shopid"
      >
        {{ shopId }}
      </div>
    </template>

    <PopinUserNotConnectedToBo
      :visible="!backOfficeUserIsLoggedIn"
      @redirectToLoginBo="reload"
      ref="userBoNotConnected"
    />
  </div>
</template>

<script lang="ts">
import {mapGetters} from 'vuex';
import {initShopClient} from 'mktg-with-google-common/api/shopClient';
import AppMenu from '@/components/menu/app-menu.vue';
import MenuItem from '@/components/menu/menu-item.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import AlertModuleUpdate from '@/components/commons/alert-update-module.vue';
import googleUrl from '@/assets/json/googleUrl.json';
import PopinUserNotConnectedToBo from '@/components/commons/user-not-connected-to-bo-popin.vue';
import NotificationPanel from '@/components/enhanced-conversions/notification-panel.vue';
import AppGettersTypes from '@/store/modules/app/getters-types';
import ActionsTypes from '@/store/modules/app/actions-types';

let resizeEventTimer;

export default {
  components: {
    AppMenu,
    MenuItem,
    AlertModuleUpdate,
    NotificationPanel,
    PopinUserNotConnectedToBo,
  },
  data() {
    return {
      countdown: 15,
      modulePsEventbusNeedUpgrade: false,
    };
  },
  computed: {
    ...mapGetters('app', [
      AppGettersTypes.GET_BILLING_SUBSCRIPTION_ACTIVE,
    ]),
    shopId() {
      return window.shopIdPsAccounts;
    },
    adBlockerExist() {
      return this.$store.getters['app/GET_ADD_BLOCKER_STATUS'];
    },
    currentlyOnLandingPage() {
      return this.$route.name === 'landing-page';
    },
    backOfficeUserIsLoggedIn() {
      return this.$store.state.app.backOfficeUserIsLoggedIn;
    },
  },
  created() {
    initShopClient({
      shopUrl: this.$store.state.app.psxMktgWithGoogleAdminAjaxUrl,
      onShopSessionLoggedOut: () => {
        this.$store.commit('app/SAVE_USER_IS_LOGGED_OUT');
      },
    });
    this.checkModulePsEventbusNeedUpgrade();
  },
  mounted() {
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
      const root = document.documentElement;
      const header = document.querySelector('#content .page-head') as HTMLElement;

      if (!header) {
        return;
      }

      root.style.setProperty('--header-height', `${header.clientHeight + 20}px`);
      root.style.setProperty('--header-height-full', `${header.offsetTop + header.clientHeight}px`);
    },
    reload() {
      window.location.reload();
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
    async checkModulePsEventbusNeedUpgrade() {
      const res = await this.$store.dispatch(`app/${ActionsTypes.GET_MODULES_VERSIONS}`, 'ps_eventbus');

      this.modulePsEventbusNeedUpgrade = await this.$store.getters[`app/${AppGettersTypes.GET_MODULE_NEED_UPGRADE}`]('ps_eventbus', res.version);
    },
  },
  watch: {
    $route() {
      this.$root.identifySegment();
    },
  },
  googleUrl,
};
</script>
