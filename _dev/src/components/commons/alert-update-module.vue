<template>
  <div class="mb-2">
    <b-alert
      v-if="errorModule"
      variant="warning"
      class="mb-0 mt-3"
      show
    >
      <VueShowdown
        tag="p"
        :extensions="['no-p-tag']"
        class="mb-0"
        :markdown="alert"
      />
      <div
        class="d-md-flex text-center align-items-center mt-2"
      >
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 md-4 mr-md-1"
          variant="primary"
          target="_blank"
          @click="updateModule"
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
      v-if="error"
      show
      variant="warning"
      class="mb-0 mt-2"
    >
      <span class="ml-2"> {{ $t('general.versionDoesNotExist') }}</span>
    </b-alert>
    <div />
  </div>
</template>

<script>
const semver = require('semver');

export default {
  name: 'AlertUpdateModule',
  props: {
    moduleName: {
      type: String,
      default: null,
      required: true,
    },
    neededVersion: {
      type: String,
      default: null,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      error: false,
      errorModule: false,
      upgradeLink: null,
      installedVersion: null,
    };
  },

  computed: {
    alert() {
      if (this.moduleName === 'ps_eventbus') {
        return this.$i18n.t('general.eventBusMustbeUpdated');
      }
      return this.$i18n.t('general.psxmarketingwithgoogleMustBedUpdated');
    },
  },

  methods: {
    async checkForInstalledVersion() {
      const res = await this.$store.dispatch('app/GET_MODULES_VERSIONS', this.moduleName);
      if (!res.version) {
        this.error = true;
        return;
      }
      // if module version >= version needed
      if (semver.gte(res.version, this.neededVersion)) {
        return;
      }
      this.upgradeLink = res.upgradeLink;
      this.installedVersion = res.version;
      this.errorModule = true;
    },
    async updateModule() {
      this.loading = true;
      try {
        await fetch(this.upgradeLink, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        });
        this.checkForInstalledVersion();
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.checkForInstalledVersion();
  },

};
</script>
