<template>
  <ps-modal
    id="MerchantCenterAccountPopinAccountIssues"
    ref="modal"
    :title="$t('gmcAccountIssues.title')"
    v-bind="$attrs"
  >
    <VueShowdown
      class="mb-3"
      :markdown="$t('gmcAccountIssues.description')"
    />
    <collapsing-issues
      :issues="issues"
    />

    <template slot="modal-footer">
      <span />
    </template>
  </ps-modal>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import PsModal from '@/components/commons/ps-modal.vue';
import CollapsingIssues from '@/components/render-issues/collapsing-issues.vue';
import {AccountIssue} from '@/components/render-issues/types';

export default defineComponent({
  name: 'MerchantCenterAccountPopinAccountIssues',
  components: {
    PsModal,
    CollapsingIssues,
  },
  props: {
    issues: {
      type: Array as PropType<AccountIssue[]>,
      required: true,
    },
  },
});
</script>
