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
      <notification-panel />
      <router-view />
      <div
        class="mt-4 container-md"
        v-if="currentlyOnLandingPage"
      >
        <VueShowdown
          :markdown="$t('landingPage.footer.explanation')"
          :extensions="['extended-link']"
          class="text-justify-center"
        />
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
import googleUrl from '@/assets/json/googleUrl.json';
import PopinUserNotConnectedToBo from '@/components/commons/user-not-connected-to-bo-popin.vue';
import NotificationPanel from '@/components/enhanced-conversions/notification-panel.vue';

let resizeEventTimer;

export default {
  components: {
    AppMenu,
    MenuItem,
    NotificationPanel,
    PopinUserNotConnectedToBo,
  },
  computed: {
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
    this.$root.identifySegment?.();
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
        params: SegmentGenericParams,
      });
    },
  },
  watch: {
    $route() {
      this.$root.identifySegment?.();
    },
  },
  googleUrl,
};
</script>
