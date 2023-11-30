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
  <div
    class="row"
  >
    <b-card
      no-body
      class="ps_gs-onboardingcard px-0 col-7"
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
                v-for="(registered, hookName) in hooks"
                :key="hookName"
              >
                {{ hookName }} - {{ registered ? '✅':'❌' }}
                <b-button
                  v-if="!registered"
                  class="ml-3"
                  variant="primary"
                  size="sm"
                  @click="registerHook(hookName)"
                >
                  🩹 Register hook
                </b-button>
              </li>
            </ul>
          </li>
        </ul>
      </b-card-body>
    </b-card>

    <b-card
      no-body
      class="ps_gs-onboardingcard px-0 col-5"
    >
      <b-card-header
        header-tag="h3"
        header-class="px-3 py-3 font-weight-600 ps_gs-fz-16 mb-0"
      >
        Actions
      </b-card-header>
      <b-card-body
        body-class="p-3"
      >
        <span
          id="tooltip-gmc-creation"
          class="d-inline-block"
          tabindex="0"
        >
          <b-button
            class="mt-3 mr-3 text-nowrap d-block"
            variant="outline-primary"
            size="sm"
            @click="triggerGmcAccountCreation"
            :disabled="!GET_GOOGLE_ACCOUNT_IS_ONBOARDED || GET_GOOGLE_MERCHANT_CENTER_IS_CONNECTED"
          >
            <img
              src="@/assets/images/google-merchant-center-icon.svg"
              width="16"
              height="16"
              alt=""
              class="float-left mr-1"
            >
            Start GMC account creation
          </b-button>
        </span>
        <b-tooltip
          target="tooltip-gmc-creation"
          triggers="hover"
          container="#psxMktgWithGoogleApp"
          v-if="GET_GOOGLE_ACCOUNT_IS_ONBOARDED && GET_GOOGLE_MERCHANT_CENTER_IS_CONNECTED"
        >
          Disconnect from your GMC account first
        </b-tooltip>

        <b-button
          class="mt-3 mr-3 d-block"
          variant="outline-danger"
          size="sm"
          @click="throwErrorForSentry"
        >
          Throw Error test for Sentry
        </b-button>
      </b-card-body>
    </b-card>

    <b-card
      no-body
      class="ps_gs-onboardingcard px-0 col-12"
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
            <b-table
              striped
              :items="GET_DEBUG_DATA.typesOfSync"
            />
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
      class="ps_gs-onboardingcard px-0 col-12"
    >
      <b-card-header
        header-tag="h3"
        header-class="px-3 py-3 font-weight-600 ps_gs-fz-16 mb-0"
      >
        ProductFeed infos
      </b-card-header>
      <b-card-body
        body-class="p-3"
      >
        <ul class="mb-0">
          <li>
            <strong>ProductFeed status</strong>:
            migration : {{ productFeed.migration ?'✅':'❌' }}
            fullSync : {{ productFeed.fullSync ?'✅':'❌' }}
          </li>
          <li>
            <b-button
              class="mt-3 mr-3"
              variant="primary"
              @click="sendMigration(true)"
              :disabled="!GET_PRODUCT_FEED_SETTINGS"
            >
              Enable migration
            </b-button>
            <b-button
              class="mt-3 mr-3"
              variant="primary"
              @click="sendMigration(false)"
              :disabled="!GET_PRODUCT_FEED_SETTINGS"
            >
              Disable migration
            </b-button>

            <span v-if="productFeed.error">An error occured while modifying migration flag.</span>
          </li>
        </ul>
      </b-card-body>
    </b-card>

    <b-card
      no-body
      class="ps_gs-onboardingcard px-0 col-12"
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
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters, mapState} from 'vuex';
import GettersTypes from '@/store/modules/campaigns/getters-types';
import GettersTypesApp from '@/store/modules/app/getters-types';
import GettersTypesAccounts from '@/store/modules/accounts/getters-types';
import GettersTypesProductFeed from '@/store/modules/product-feed/getters-types';

export default defineComponent({
  data() {
    return {
      hooks: [],
      sync: {
        requested: false,
        loading: false,
        error: false,
      },
      productFeed: {
        migration: false,
        fullSync: false,
        error: false,
      },
      appBuildVersion: import.meta.env.VITE_BUILD_VERSION || 'Not provided',
    };
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
    ...mapGetters('accounts', [
      GettersTypesAccounts.GET_GOOGLE_ACCOUNT_IS_ONBOARDED,
      GettersTypesAccounts.GET_GOOGLE_MERCHANT_CENTER_IS_CONNECTED,
    ]),
    ...mapGetters('productFeed', [
      GettersTypesProductFeed.GET_PRODUCT_FEED_SETTINGS,
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
    async sendMigration(migrationStatus) {
      this.productFeed.error = true;
      try {
        this.productFeed.migration = migrationStatus;
        this.productFeed.fullSync = migrationStatus;
        await this.$store.dispatch('productFeed/SEND_PRODUCT_FEED_FLAGS', this.productFeed);
      } catch (error) {
        this.productFeed.error = true;
        console.error(error);
      } finally {
        this.getProductFeed();
      }
    },
    async getHooks() {
      const res = await this.$store.dispatch('app/GET_MODULES_VERSIONS', 'psxmarketingwithgoogle');
      this.hooks = res.hooks;
    },
    async registerHook(hookName: string) {
      await this.$store.dispatch('app/TRIGGER_REGISTER_HOOK', hookName);
      await this.getHooks();
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
    async triggerGmcAccountCreation() {
      await this.$router.push({
        name: 'configuration',
      });
      this.$root.$emit('startGmcAccountCreation');
    },
    throwErrorForSentry() {
      throw new Error('Test error for sentry');
    },
    getProductFeed() {
      this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS').then((res) => {
        this.productFeed.migration = res?.migration;
        this.productFeed.fullSync = res?.fullSync;
      });
    },
  },
  mounted() {
    this.$store.dispatch('accounts/WARMUP_STORE');
    this.$store.dispatch('campaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE');
    this.$store.dispatch('campaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED');
    this.getProductFeed();
    this.$store.dispatch('app/REQUEST_DEBUG_DATA');
    this.getHooks();
  },
});
</script>
