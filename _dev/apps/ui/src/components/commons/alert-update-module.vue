<template>
  <div>
    <PsToast
      v-if="moduleIsUpdated"
      variant="success"
      :visible="moduleIsUpdated"
      toaster="b-toaster-top-right"
      body-class="border border-success"
    >
      <div>
        <h3 class="mb-1">
          {{ $t("toast.moduleUpdated.successTitle") }}
        </h3>
        <p>{{ $t("toast.moduleUpdated.successSubtitle") }}</p>
      </div>
    </PsToast>
    <PsToast
      v-if="displayFailedToast"
      :visible="displayFailedToast"
      variant="warning"
      toaster="b-toaster-top-right"
      body-class="border border-warning"
    >
      <div>
        <h3 class="mb-1">
          {{ $t("toast.moduleUpdated.failedTitle") }}
        </h3>
        <p>{{ $t("toast.moduleUpdated.failedSubtitle") }}</p>
      </div>
    </PsToast>

    <div
      v-if="!moduleIsUpdated"
      class="mb-2 two-panel-max-width"
      :class="classAlert"
    >
      <b-alert
        variant="warning"
        class="mb-0 border border-warning d-md-flex justify-content-between align-items-start"
        show
      >
        <div>
          <slot
            v-if="hasTitleSlot"
            name="title"
          />
          <div
            class="h3 font-weight-600"
            v-else
          >
            {{ $t('general.moduleUpdateNeeded.' + moduleName + '.title') }}
          </div>
          <slot
            v-if="hasContentSlot"
            name="content"
          />
          <VueShowdown
            v-else
            :markdown="paragraph"
          />
          <ul
            class="feature-list"
            v-if="featuresList"
          >
            <li
              v-for="(feature, index) in featuresList"
              :key="index"
            >
              {{ feature }}
            </li>
          </ul>
        </div>
        <div
          class="d-md-flex text-center align-items-center"
          v-if="upgradeLink"
        >
          <b-button
            class="mx-1 mt-3 mt-md-0 md-4 mr-md-1 text-nowrap"
            variant="warning"
            target="_blank"
            @click="handleUpdateModule"
            :disabled="loading"
          >
            <span v-if="loading">
              <span class="icon-busy icon-busy--dark mr-2" />
            </span>
            <span>
              {{ $t('cta.updateModule') }}
            </span>
          </b-button>
        </div>
      </b-alert>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import semver from 'semver';
import translations from 'mktg-with-google-common/translations/en/ui.json';
import useUpdateModule from './update-module-utilities';
import PsToast from '@/components/commons/ps-toast.vue';

export default defineComponent({
  props: {
    moduleName: {
      type: String,
      required: true,
    },
    classAlert: {
      type: String,
      default: undefined,
    },
  },
  components: {PsToast},
  data() {
    return {
      loading: false,
      errorModule: false,
      upgradeLink: null,
      installedVersion: null as string|null,
      moduleIsUpdated: false,
      displayFailedToast: false,
      updateModule: null as (() => Promise<boolean>) | null,
    };
  },

  computed: {
    hasTitleSlot() {
      return !!this.$slots.title;
    },
    hasContentSlot() {
      return !!this.$slots.content;
    },
    paragraph(): string {
      return this.$tc(`general.moduleUpdateNeeded.${this.moduleName}.paragraph`,
        (this.featuresList ? this.featuresList.length : 0));
    },
    featuresList(): string[] {
      if (this.installedVersion === null) {
        return [];
      }

      const features: string[] = [];

      Object.keys(translations.general.moduleUpdateNeeded[this.moduleName].changes
        || {}).forEach(
        (version: string) => {
          if (semver.gt(version, this.installedVersion as string)) {
            if (translations.general.moduleUpdateNeeded[this.moduleName]
              .changes[version]) {
              const featuresSubset = this.$t(`general.moduleUpdateNeeded.${this.moduleName}.changes["${version}"]`);

              if (typeof featuresSubset === 'string') {
                features.push(featuresSubset);
              } else {
                features.push(...featuresSubset);
              }
            }
          }
        },
      );
      return features;
    },
  },

  methods: {
    async handleUpdateModule() {
      this.loading = true;

      const {updateModule} = useUpdateModule(
        this.moduleName,
        () => {
          this.$emit('updateSuccess', true);
          this.moduleIsUpdated = true;
          window.location.reload();
        },
        (err) => {
          console.error(err);
          this.$emit('updateSuccess', false);
          this.displayFailedToast = true;
        },
      );
      await updateModule();

      this.loading = false;
    },
  },
  async mounted() {
    const {getLinkUpgrade} = useUpdateModule(
      this.moduleName,
    );
    this.upgradeLink = await getLinkUpgrade();
  },
});
</script>
