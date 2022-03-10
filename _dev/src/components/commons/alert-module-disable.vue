<template>
  <div
    class="mb-2"
    v-if="isEnabled === false"
  >
    <b-alert
      variant="warning"
      class="mb-0 mt-3"
      show
    >
      <VueShowdown
        tag="span"
        :extensions="['no-p-tag']"
        class="mt-2"
        :markdown="$t('general.moduleNeedActivation')"
      />
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0 md-4 mr-md-1 float-right"
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
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'AlertModuleDisable',
  data() {
    return {
      loading: null,
      isEnabled: null,
      enableLink: null,
    };
  },
  methods: {
    async getModuleInfo() {
      const res = await this.$store.dispatch('app/GET_MODULE_DEBUG');
      this.isEnabled = res.isEnabled;
      this.enableLink = res.enableLink;
    },
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
      }
    },
  },
  created() {
    this.getModuleInfo();
  },
};
</script>
