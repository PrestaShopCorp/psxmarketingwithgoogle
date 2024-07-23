<template>
  <div class="row mb-4">
    <div class="col-12 col-md-5">
      <div
        class="is-sticky pb-3 pt-2"
      >
        <h2>{{ title }}</h2>

        <p v-if="description">
          {{ description }}
        </p>
      </div>
    </div>
    <div class="col-12 col-md-7">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';
import {TranslateResult} from 'vue-i18n';

export default defineComponent({
  name: 'TwoPanelCols',
  props: {
    title: {
      required: true,
      type: String as PropType<TranslateResult|string>,
    },
    description: {
      type: String as PropType<TranslateResult|string|null>,
      required: false,
      default: null,
    },
  },
});
</script>
