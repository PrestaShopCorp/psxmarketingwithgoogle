<template>
  <div
    class="mb-2 no-max-width"
    v-if="isEnabled === false"
  >
    <b-alert
      variant="warning"
      class="mb-0 mt-3"
      show
    >
      <div class="row">
        <div class="col-8">
          <VueShowdown
            tag="p"
            :extensions="['no-p-tag']"
            :markdown="$t('general.moduleNeedActivation')"
          />
        </div>
        <div class="col-4 text-right">
          <b-button
            size="sm"
            variant="primary"
            target="_blank"
            @click="activateModule"
          >
            <span v-if="loading">
              <span class="icon-busy icon-busy--dark" />
            </span>
            <span
              v-else
            >
              {{ $t('cta.activateModule') }}
            </span>
          </b-button>
        </div>
      </div>
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'AlertModuleDisabled',
  data() {
    return {
      loading: false,
      isEnabled: this.$store.state.app.psxMktgWithGoogleModuleIsEnabled,
      enableLink: this.$store.state.app.psxMktgWithGoogleEnableLink,
    };
  },
  methods: {
    async activateModule() {
      this.loading = true;
      try {
        await fetch(this.enableLink, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.isEnabled = true;
        this.loading = false;
        window.location.reload();
      }
    },
  },
};
</script>
