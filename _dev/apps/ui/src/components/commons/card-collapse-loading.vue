<template>
  <card-collapse
    v-bind="$attrs"
  >
    <div
      slot="title"
      class="flex-grow-1"
    >
      <b-skeleton class="m-2" />
    </div>
    <div slot="content">
      <b-skeleton class="m-2" />
    </div>
  </card-collapse>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import CardCollapse from './card-collapse.vue';

export default defineComponent({
  name: 'CardCollapseLoading',
  components: {
    CardCollapse,
  },
});
</script>
