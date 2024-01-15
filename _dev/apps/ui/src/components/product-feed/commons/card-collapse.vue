<template>
  <b-card
    no-body
  >
    <b-card-header>
      <slot name="title"></slot>
    </b-card-header>

    <b-card-body>
      <slot name="content"></slot>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CardCollapse',
});
</script>