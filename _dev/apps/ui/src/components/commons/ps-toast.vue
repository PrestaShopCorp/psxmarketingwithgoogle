 <!-- component waits for props : visible/variant/toaster and text inside is in child -->
<template>
  <b-toast
    solid
    v-bind="$attrs"
    v-on="$listeners"
    no-close-button
    :id="id"
    toast-class="bg-transparent border-0"
    :body-class="`alert alert-${$attrs.variant} mb-0`"
  >
    <div class="d-flex pr-0 align-items-start">
      <slot />
      <button
        type="button"
        aria-label="Close"
        class="close ml-auto mb-1"
        @click="$bvToast.hide(id)"
      >
        ×
      </button>
    </div>
    <slot name="toast-title" />
  </b-toast>
</template>
<script>
import {BToast} from 'bootstrap-vue';

export default {
  name: 'PsToast',
  data() {
    return {
      // eslint-disable-next-line no-underscore-dangle
      id: this._uid.toString(),
    };
  },
  inheritAttrs: false,
  components: {BToast},
};
</script>
