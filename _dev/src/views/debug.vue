<!--**
 * 2007-2020 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2020 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 *-->
<template>
  <div>
    <b-card
      no-body
      class="ps_gs-onboardingcard px-0"
    >
      <b-card-header
        header-tag="h3"
        header-class="px-3 py-3 font-weight-600 ps_gs-fz-16 mb-0"
      >
        Shop info
      </b-card-header>
      <b-card-body
        body-class="p-3"
      >
        <ul class="mb-0">
          <li>
            <strong>Shop url</strong>: {{ this.$store.state.app.psxMktgWithGoogleShopUrl }}
          </li>
          <li>
            <strong>Versions</strong>:
            <ul>
              <li>
                <strong>Prestashop</strong>: {{ this.$store.state.app.psVersion }}
              </li>
              <li>
                <strong>PHP Engine</strong>: {{ this.$store.state.app.phpVersion }}
              </li>
              <li>
                <strong>Module (PHP)</strong>:
                {{ this.$store.state.app.psxMktgWithGoogleModuleVersion }}
              </li>
              <li>
                <strong>Interface (Vue.js)</strong>: {{ appBuildVersion }}
              </li>
            </ul>
          </li>
          <li>
            <strong>Shop ID</strong>: {{ shopId }}
          </li>
          <li>
            <strong>Using the production API</strong>:
            {{ psxMktgWithGoogleOnProductionEnvironment?'✅':'❌' }}
            ({{ psxMktgWithGoogleApiUrl }})
          </li>
          <li>
            <strong>Module is enabled</strong>:
            {{ moduleIsEnabled ?'✅':'❌' }}
          </li>
          <li>
            <strong>Hook list</strong>:
            <ul>
              <li
                v-for="(type, hookName) in hooks"
                :key="hookName"
              >
                {{ hookName }} - {{ type ? '✅':'❌' }}
              </li>
            </ul>
          </li>
        </ul>
      </b-card-body>
    </b-card>

    <b-card
      no-body
      class="ps_gs-onboardingcard px-0"
    >
      <b-card-header
        header-tag="h3"
        header-class="px-3 py-3 font-weight-600 ps_gs-fz-16 mb-0"
      >
        Synchronisation
      </b-card-header>
      <b-card-body
        body-class="p-3"
      >
        <ul class="mb-0">
          <li>
            <strong>Link to PS Event Bus Health Check:</strong>
            <a
              :href="GET_DEBUG_DATA.urlEventBusHealthCheck"
              target="_blank"
            >
              {{ GET_DEBUG_DATA.urlEventBusHealthCheck }}
            </a>
          </li>
          <li>
            <strong>Types of data synchronized by Event Bus</strong>
            ({{ GET_DEBUG_DATA.typesOfSync.length }}):
            <ul>
              <li
                v-for="(type, index) in GET_DEBUG_DATA.typesOfSync"
                :key="index"
              >
                {{ type }}
              </li>
            </ul>
          </li>
          <li>
            <strong>Manual sync:</strong>
            <ul>
              <li>
                <strong>Status:</strong> {{ syncTriggerStatus }}
              </li>
            </ul>
            <b-button
              class="mt-3 mr-3"
              variant="primary"
              @click="triggerSync(false)"
              :disabled="triggerOfSyncForbidden"
            >
              Trigger synchronisation<br>
              (Shop → Event Bus → Google)
            </b-button>
            <b-button
              class="mt-3 mr-3"
              variant="primary"
              @click="triggerSync(true)"
              :disabled="triggerOfSyncForbidden"
            >
              Trigger full synchronisation<br>
              (Shop → Event Bus → Google)
            </b-button>
            <b-button
              class="mt-3 mr-3"
              variant="primary"
              @click="triggerGoogleSync"
              :disabled="triggerOfSyncForbidden"
            >
              Trigger synchronisation<br>
              (Event Bus → Google only)
            </b-button>
          </li>
        </ul>
      </b-card-body>
    </b-card>

    <b-card
      no-body
      class="ps_gs-onboardingcard px-0"
    >
      <b-card-header
        header-tag="h3"
        header-class="px-3 py-3 font-weight-600 ps_gs-fz-16 mb-0"
      >
        Remarketing
      </b-card-header>
      <b-card-body
        body-class="p-3"
      >
        <ul class="mb-0">
          <li>
            <strong>Remarketing tag is implemented by a third party module:</strong>
            {{ GET_REMARKETING_TRACKING_TAG_ALREADY_EXIST_STATUS?'✅':'❌' }}
          </li>
          <li>
            <strong>
              Remarketing tag is implemented and enabled by "PrestaShop Marketing With Google":
            </strong>
            {{ GET_REMARKETING_TRACKING_TAG_IS_SET?'✅':'❌' }}
          </li>
          <li>
            <strong>List of conversion actions set on front-office</strong>
            ({{ GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED.length }}):
            <ul>
              <li
                v-for="action in GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED"
                :key="action.category"
              >
                {{ action.category }}:
                <code>{{ action.tag }}</code>
              </li>
            </ul>
          </li>
        </ul>
      </b-card-body>
    </b-card>

    <b-card
      no-body
      class="ps_gs-onboardingcard px-0"
    >
      <b-card-header
        header-tag="h3"
        header-class="px-3 py-3 font-weight-600 ps_gs-fz-16 mb-0"
      >
        Error reporting
      </b-card-header>
      <b-card-body
        body-class="p-3"
      >
        <b-button
          class="mt-3 mr-3"
          variant="danger"
          @click="throwErrorForSentry"
        >
          Throw Error test for Sentry
        </b-button>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import GettersTypes from '@/store/modules/campaigns/getters-types.ts';
import GettersTypesApp from '@/store/modules/app/getters-types.ts';

export default {
  name: 'Debug',
  data() {
    return {
      hooks: [],
      sync: {
        requested: false,
        loading: false,
        error: false,
      },
      appBuildVersion: process.env.VUE_APP_BUILD_VERSION || 'Not provided',
    };
  },
  components: {
  },
  props: {
  },
  computed: {
    ...mapGetters('campaigns', [
      GettersTypes.GET_REMARKETING_TRACKING_TAG_IS_SET,
      GettersTypes.GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED,
      GettersTypes.GET_REMARKETING_TRACKING_TAG_ALREADY_EXIST_STATUS,
    ]),
    ...mapGetters('app', [
      GettersTypesApp.GET_DEBUG_DATA,
    ]),
    ...mapState({
      psxMktgWithGoogleApiUrl: (state) => state.app.psxMktgWithGoogleApiUrl,
      psxMktgWithGoogleOnProductionEnvironment:
        (state) => state.app.psxMktgWithGoogleOnProductionEnvironment,
    }),
    shopId() {
      return window.shopIdPsAccounts || 'none yet';
    },
    moduleIsEnabled() {
      return this.$store.state.app.psxMktgWithGoogleModuleIsEnabled;
    },
    triggerOfSyncForbidden() {
      return this.sync.requested
        || this.sync.loading
        || !this.psxMktgWithGoogleOnProductionEnvironment;
    },
    syncTriggerStatus() {
      if (this.sync.loading) {
        return 'Waiting for an answer from Event Bus...';
      }
      if (this.sync.requested) {
        return 'Synchronisation succesfully requested';
      }
      if (this.sync.error) {
        return 'Synchronisation request failed';
      }
      if (!this.psxMktgWithGoogleOnProductionEnvironment) {
        return 'Synchronisation is only possible on production';
      }
      return '/';
    },
  },
  methods: {
    async triggerSync(full = false) {
      this.sync.loading = true;
      this.sync.error = false;
      try {
        await this.$store.dispatch('productFeed/REQUEST_SYNCHRONISATION', full);
        this.sync.requested = true;
      } catch (err) {
        console.error(err);
        this.sync.error = true;
      } finally {
        this.sync.loading = false;
      }
    },
    getHooks() {
      this.$store.dispatch('app/GET_MODULES_VERSIONS', 'psxmarketingwithgoogle')
        .then((res) => {
          this.hooks = res.hooks;
        });
    },
    async triggerGoogleSync() {
      this.sync.loading = true;
      this.sync.error = false;
      try {
        await this.$store.dispatch('productFeed/REQUEST_GOOGLE_SYNCHRONISATION');
        this.sync.requested = true;
      } catch (err) {
        console.error(err);
        this.sync.error = true;
      } finally {
        this.sync.loading = false;
      }
    },
    throwErrorForSentry() {
      throw new Error('Test error for sentry');
    },
  },
  mounted() {
    this.$store.dispatch('campaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE');
    this.$store.dispatch('campaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED');
    this.$store.dispatch('app/REQUEST_DEBUG_DATA');
    this.getHooks();
  },
};
</script>
