<template>
  <div
    class="text-muted ps_gs-fz-12 mb-0 mt-2
    text-right"
  >
    <span class="material-icons-round d-inline-block align-middle mr-1 ps_gs-fz-14 text-secondary">
      help_outline
    </span>
    <p class="d-inline-block align-middle ">
      {{ $t(message) }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'SettingsFooter',
  props: {
    message: {
      type: String,
      default: 'productFeedSettings.noticeDataStored',
      required: false,
    },
  },
};
</script>
