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
      {{ $t('monetization.popinUpdateTitle') }}
    </template>
    <b-alert
      v-if="updateFailed"
      show
      variant="warning"
      class="mb-4 border border-warning"
    >
      <h3 class="mb-1">
        {{ $t("monetization.failedUpdatedTitle") }}
      </h3>
      <p>{{ $t("monetization.failedUpdatedSubtitle") }}</p>
    </b-alert>
    <div v-if="text">
      {{ text }}
    </div>
    <slot name="content" />
    <div class="mb-3 d-flex justify-content-end mt-4">
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

<script lang="ts">
import {defineComponent} from 'vue';
import ActionsTypes from '@/store/modules/app/actions-types';
import PsModal from '@/components/commons/ps-modal.vue';

export default defineComponent({
  components: {
    PsModal,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      updateFailed: false,
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

        await fetch(res?.upgradeLink, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        });

        this.$emit('updateSuccess', true);
        window.location.reload();
      } catch (err) {
        this.updateFailed = true;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
