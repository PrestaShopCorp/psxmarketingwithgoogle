<template>
  <b-alert
    class="border border-warning d-md-flex align-items-md-center"
    variant="warning"
    show
  >
    <div>
      <h3 class="h3">
        {{ $t('banner.monetization.bannerWarningTitle') }}
      </h3>
      <p>
        {{ $t('banner.monetization.bannerWarningText') }}
      </p>
    </div>
    <b-button
      class="mt-3 btn btn-warning px-3 py-2 ml-3 d-flex flex-shrink-0"
      variant="warning"
      @click="updateModule"
    >
      <i
        v-if="loading"
        class="ps_gs-table-products__spinner icon-spinner mr-2"
      >loading</i>
      {{ $t('cta.updateModule') }}
    </b-button>
  </b-alert>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ActionsTypes from '@/store/modules/app/actions-types';

export default defineComponent({
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async updateModule() {
      if (this.loading) {
        return;
      }

      this.loading = true;
      try {
        const res = await this.$store.dispatch(`app/${ActionsTypes.GET_MODULES_VERSIONS}`, 'psxmarketingwithgoogle');

        if (res?.upgradeLink) {
          await fetch(res?.upgradeLink, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
          });

          this.$emit('moduleUpdated');
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
