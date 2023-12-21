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
        class="ps_gs-sticky-head page-head-tabs"
      >
        <AppMenu>
          <MenuItem
            v-if="!currentlyOnLandingPage"
            :route="{name: 'campaign'}"
          >
            {{ $t('general.tabs.campaign') }}
          </MenuItem>
          <MenuItem
            v-if="!currentlyOnLandingPage"
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
      <AlertModuleUpdate
        module-name="ps_eventbus"
        :needed-version="this.$store.state.app.cloudsyncVersionNeeded"
      />
      <AlertModuleUpdate
        module-name="psxmarketingwithgoogle"
        :needed-version="this.$store.state.app.psxMktgWithGoogleModuleVersionNeeded"
      />
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
import {initShopClient} from 'mktg-with-google-common/api/shopClient';
import AppMenu from '@/components/menu/app-menu.vue';
import MenuItem from '@/components/menu/menu-item.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import AlertModuleUpdate from '@/components/commons/alert-update-module.vue';
import googleUrl from '@/assets/json/googleUrl.json';
import PopinUserNotConnectedToBo from '@/components/commons/user-not-connected-to-bo-popin.vue';

let resizeEventTimer;

export default {
  components: {
    AppMenu,
    MenuItem,
    AlertModuleUpdate,
    PopinUserNotConnectedToBo,
  },
  data() {
    return {
      countdown: 15,
    };
  },
  computed: {
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

      const header = document.querySelector('#content .page-head');
      const headerFull = document.querySelector('#header_infos');
      root.style.setProperty('--header-height', `${header.clientHeight}px`);
      root.style.setProperty('--header-height-full', `${header.clientHeight + headerFull.clientHeight}px`);
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
  },
  watch: {
    $route() {
      this.$root.identifySegment();
    },
  },
  googleUrl,
};
</script>
