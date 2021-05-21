<template>
	<b-alert
    class="ps_gs-toast pr-5"
    v-bind="$attrs"
    v-on="$listeners"
    dismissible
    fade
  >
		<slot></slot>
		<slot name="dismiss"></slot>
	</b-alert>
</template>
<script>
	import { BAlert } from 'bootstrap-vue';

	export default {
		name: 'PsToast',
		inheritAttrs: false,
		components: { BAlert },
	}
</script>
