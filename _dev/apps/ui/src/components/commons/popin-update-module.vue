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

    <PsModal
      v-if="!moduleIsUpdated"
      v-bind="$attrs"
      hide-footer
      visible
      @hidden="$emit('closeModale')"
    >
      <template #modal-title>
        <slot name="title" />
      </template>

      <b-alert
        v-if="updateFailed"
        show
        variant="warning"
        class="mb-4 border border-warning"
      >
        <h3 class="mb-1">
          {{ $t("toast.moduleUpdated.failedTitle") }}
        </h3>
        <p>{{ $t("toast.moduleUpdated.failedSubtitle") }}</p>
      </b-alert>
      <slot name="content" />
      <div class="mb-3 d-flex justify-content-end mt-4">
        <b-button
          variant="primary"
          @click="handleUpdateModule"
          class="d-flex"
        >
          <i
            v-if="loading"
            class="ps_gs-table-products__spinner bg-transparent mr-2"
            style="height: 20px; width: 20px;"
          >loading</i>
          {{ $t('cta.updateModule') }}
        </b-button>
      </div>
    </PsModal>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import PsModal from '@/components/commons/ps-modal.vue';
import PsToast from '@/components/commons/ps-toast.vue';
import useUpdateModule from './update-module-utilities';

export default defineComponent({
  components: {
    PsModal,
    PsToast,
  },
  props: {
    moduleName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      updateFailed: false,
      upgradeLink: false,
      moduleIsUpdated: false,
    };
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
          this.updateFailed = true;
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
