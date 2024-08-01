<template>
  <b-alert
    class="border border-warning d-md-flex align-items-md-center"
    variant="warning"
    show
  >
    <div>
      <h3 class="h3">
        {{ $t('monetization.bannerWarningTitle') }}
      </h3>
      <p>
        {{ $t('monetization.bannerWarningText') }}
      </p>
    </div>
    <b-button
      class="mt-3 mt-md-0 btn btn-warning px-3 py-2 ml-3 d-flex flex-shrink-0"
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
  name: 'MonetizationAlertWarningUpdateMondule',
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

        await fetch('http://zzefzefazc.com', {
          method: 'POST',
          headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        });

        this.$emit('updateSuccess', true);
        window.location.reload();
      } catch (err) {
        console.error(err);
        this.$emit('updateSuccess', false);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
