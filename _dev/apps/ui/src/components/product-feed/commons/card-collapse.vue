<template>
  <b-card
    no-body
  >
    <b-card-header
      class="p-0"
    >
      <b-button
        block
        v-b-toggle="id"
        class="d-flex btn-without-hover align-items-center"
        variant="invisible"
      >
        <slot name="title"/>
        <i
          aria-hidden="true"
          class="material-icons ps_gs-fz-24 text-secondary ml-auto when-closed"
        >
          expand_more
        </i>
        <i
          aria-hidden="true"
          class="material-icons ps_gs-fz-24 text-secondary ml-auto when-open"
        >
          expand_less
        </i>
      </b-button>
    </b-card-header>

    <b-collapse :id="id">
      <b-card-body>
        <slot name="content"/>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CardCollapse',
  data() {
    return {
      // eslint-disable-next-line no-underscore-dangle
      id: this._uid.toString(),
    };
  },
});
</script>
