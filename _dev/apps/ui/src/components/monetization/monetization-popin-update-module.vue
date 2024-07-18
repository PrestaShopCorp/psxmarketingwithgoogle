<template>
  <ps-modal
    v-bind="$attrs"
    hide-footer
    visible
    @hidden="$emit('closeModale')"
  >
    <template #modal-title>
      <h4
        class="rounded-circle
        bg-ocean-blue-50 d-inline-flex align-items-center justify-content-center mr-2"
        style="width: 40px; height: 40px;"
      >
        <i class="material-icons ps_gs-fz-24">update</i>
      </h4>
      {{ $t('banner.monetization.popinUpdateTitle') }}
    </template>
    <slot name="content" />
    <div class="mb-3 d-flex justify-content-end mt-3">
      <template>
        <b-button
          variant="primary"
          @click="updateModule()"
          class="d-flex"
        >
          <i
            v-if="loading"
            class="ps_gs-table-products__spinner bg-transparent mr-2"
            style="height: 20px; width: 20px;"
          >loading</i>
          {{ $t('cta.updateModule') }}
        </b-button>
      </template>
    </div>
  </ps-modal>
</template>

<script>
import {defineComponent} from 'vue';
import ActionsTypes from '@/store/modules/app/actions-types';
import PsModal from '../commons/ps-modal';

export default defineComponent({
  components: {
    PsModal,
  },
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
