Skip to content
Search or jump to…
Pull requests
Issues
Marketplace
Explore

@PoulainMaxime
PrestaShopCorp
/
psxmarketingwithgoogle
Public
Code
Pull requests
5
Actions
Security
30
Insights
We found potential security vulnerabilities in your dependencies.
psxmarketingwithgoogle/_dev/src/App.vue
@elisegriset92
elisegriset92 add footer when landing page
Latest commit ed77393 22 hours ago
 History
 6 contributors
@elisegriset92@fox-john@amaury-hanser@m-Poulain@Quetzacoalt91@PoulainMaxime
168 lines (164 sloc)  4.68 KB

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
            <MenuItem
            v-if="psAccountIsOnboarded"
            @click.native="throwSegmentEvent"
            :route="{name: 'reporting'}"
          >
            {{ $t('general.tabs.reporting') }}
          </MenuItem>

          <MenuItem
            v-if="psAccountIsOnboarded"
            :route="{name: 'product-feed'}"
          >
            {{ $t('general.tabs.exportStatus') }}
          </MenuItem>
          <MenuItem
            v-if="psAccountIsOnboarded"
            :route="{name: 'campaign'}"
          >
            {{ $t('general.tabs.campaign') }}
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
        class="ps_gs-landingpage-content__muted text-muted bg-transparent mt-4"
        v-if="$route.name === 'landing-page'"
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
    <div
      id="helper-pmax"
      class="p-3 d-flex"
    >
      <span class="material-icons d-inline-block align-middle mr-3 msg-icon-custom">
        chat
      </span>
      <VueShowdown
        :markdown="$t('modal.textPmaxReleased', [
          new Date('2022-06-30').toLocaleDateString(),
          this.$options.googleUrl.pmaxReleaseLink
        ])"
        :extensions="['extended-link', 'no-p-tag']"
      />
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu/menu.vue';
import MenuItem from '@/components/menu/menu-item.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import AlertModuleUpdate from '@/components/commons/alert-update-module';
import googleUrl from '@/assets/json/googleUrl.json';

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
    shopId() {
      return window.shopIdPsAccounts;
    },
    adBlockerExist() {
      return this.$store.getters['app/GET_ADD_BLOCKER_STATUS'];
    },
    psAccountIsOnboarded() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED'];
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
  googleUrl,
};
</script>
