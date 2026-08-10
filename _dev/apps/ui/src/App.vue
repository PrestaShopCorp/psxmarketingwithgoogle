<template>
  <div id="psxMktgWithGoogleApp">
    <div
      id="head_tabs"
      class="ps_gs-sticky-head"
    >
      <AppMenu>
        <MenuItem :route="{name: 'product-feed'}">
          {{ $t('general.tabs.productFeed') }}
        </MenuItem>
        <MenuItem :route="{name: 'configuration'}">
          {{ $t('general.tabs.configuration') }}
        </MenuItem>
        <MenuItem :route="{name: 'help'}">
          {{ $t('general.tabs.help') }}
        </MenuItem>
      </AppMenu>
      <b-toaster
        name="b-toaster-top-right"
        class="ps_gs-toaster-top-right"
      />
    </div>
    <router-view />

    <PopinUserNotConnectedToBo
      ref="userBoNotConnected"
      :visible="!backOfficeUserIsLoggedIn"
      @redirectToLoginBo="reload"
    />
  </div>
</template>

<script lang="ts">
import {initShopClient} from 'mktg-with-google-common/api/shopClient';
import AppMenu from '@/components/menu/app-menu.vue';
import MenuItem from '@/components/menu/menu-item.vue';
import PopinUserNotConnectedToBo from '@/components/commons/user-not-connected-to-bo-popin.vue';

let resizeEventTimer;

export default {
  components: {
    AppMenu,
    MenuItem,
    PopinUserNotConnectedToBo,
  },
  computed: {
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
  },
};
</script>
