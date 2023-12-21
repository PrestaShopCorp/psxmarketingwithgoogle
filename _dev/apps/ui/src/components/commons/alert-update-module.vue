<template>
  <div class="mb-2 two-panel-max-width">
    <b-alert
      v-if="errorModule"
      variant="warning"
      class="mb-0 mt-3"
      show
    >
      <VueShowdown
        :markdown="$t(`general.moduleUpdateNeeded.${moduleName}.title`)"
      />
      <ul v-if="featuresList">
        <li
          v-for="(feature, index) in featuresList"
          :key="index"
        >
          {{ feature }}
        </li>
      </ul>
      <div
        class="d-md-flex text-center align-items-center mt-2"
        v-if="upgradeLink"
      >
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 md-4 mr-md-1"
          variant="outline-secondary"
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
  </div>
</template>

<script lang="ts">
import semver from 'semver';
import {defineComponent} from 'vue';
import translations from 'mktg-with-google-common/translations/en/ui.json';

export default defineComponent({
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
      errorModule: false,
      upgradeLink: null,
      installedVersion: null as string|null,
    };
  },

  computed: {
    featuresList(): string[] {
      if (this.installedVersion === null) {
        return [];
      }

      const features = [];
      Object.keys(translations.general.moduleUpdateNeeded[this.moduleName].changes || {}).forEach(
        (version: string) => {
          if (semver.gt(version, this.installedVersion as string)) {
            const featuresSubset = this.$t(`general.moduleUpdateNeeded.${this.moduleName}.changes["${version}"]`);

            if (typeof featuresSubset === 'string') {
              features.push(featuresSubset);
            } else {
              features.push(...featuresSubset);
            }
          }
        },
      );
      return features;
    },
  },

  methods: {
    async checkForInstalledVersion() {
      const res = await this.$store.dispatch('app/GET_MODULES_VERSIONS', this.moduleName);

      let version = null;

      if (res.version) {
        version = res.version;
      }
      // Before v1.11.0, there is no such route, but we can try to get
      // the version in psxMktgWithGoogleModuleVersion instead for the Google module
      if (!version
        && this.moduleName === 'psxmarketingwithgoogle'
        && this.$store.state.app.psxMktgWithGoogleModuleVersion
      ) {
        version = this.$store.state.app.psxMktgWithGoogleModuleVersion;
      }

      if (!version) {
        return;
      }

      // if module version >= version needed
      if (semver.gte(version, this.neededVersion)) {
        this.errorModule = false;
        return;
      }
      this.upgradeLink = res?.upgradeLink;
      this.installedVersion = version;
      this.errorModule = true;
    },

    async updateModule() {
      this.loading = true;
      try {
        await fetch(this.upgradeLink, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        });
        await this.checkForInstalledVersion();
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
});
</script>
