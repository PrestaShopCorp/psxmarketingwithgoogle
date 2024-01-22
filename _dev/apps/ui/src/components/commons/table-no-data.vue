<template>
  <tr>
    <td
      :colspan="colspan"
      class="py-5 text-center text-secondary"
    >
      <div>
        <i class="material-icons ps_gs-fz-48">layers_clear</i>
      </div>
      <div
        class="ps_gs-fz-16 font-weight-600"
      >
        {{ $t('general.noResults') }}
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'TableNoData',
  props: {
    colspan: {
      required: true,
      type: Number,
    },
  },
});
</script>
