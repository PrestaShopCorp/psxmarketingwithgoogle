<template>
  <b-alert
    show
    variant="secondary"
    class="ps_gs-alert-tips-and-tricks p-0 pt-2 pb-2"
  >
    <div class="d-flex ps_gs-fz-16 font-weight-500 text-primary">
      <i class="material-icons-outlined ps_gs-fz-20 mr-1 mb-0 align-center">
        lightbulb
      </i>
      {{ $t('tipsAndTricks.title') }}
    </div>
    <VueShowdown
      tag="p"
      :extensions="['no-p-tag']"
      :markdown="content"
    />
    <b-button
      v-b-toggle="`tips-and-tricks`"
      class="d-flex btn-without-hover pl-2 mt-1 mb-1 text-primary"
      variant="invisible"
      v-if="readMore"
    >
      <i
        aria-hidden="true"
        class="material-icons ps_gs-fz-24 ml-auto when-closed"
      >
        arrow_right
      </i>
      <i
        aria-hidden="true"
        class="material-icons ps_gs-fz-24 ml-auto when-open"
      >
        arrow_drop_down
      </i>
      {{ $t('general.readMore') }}
    </b-button>
    <b-collapse
      id="tips-and-tricks"
      class="ps_gs-fz-12"
    >
      {{ readMore }}
    </b-collapse>
  </b-alert>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {BCollapse} from 'bootstrap-vue';

export default defineComponent({
  name: 'TipsAndTricksCard',
  components: {
    BCollapse,
  },
  props: {
    content: {
      type: String as PropType<string>,
      rquired: true,
      default: null,
    },
    readMore: {
      type: String as PropType<string|null>,
      rquired: false,
      default: null,
    },
  },
});
</script>
