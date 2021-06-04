<template>
  <div
    class="text-muted ps_gs-fz-12 mb-0 mt-2
    d-flex align-items-start align-items-sm-center justify-content-end"
  >
    <span class="material-icons-round mr-1 ps_gs-fz-12 align-middle">
      error_outline
    </span>
    <p>
      {{ message || $t('productFeedSettings.noticeDataStored') }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'ProductFeedSettingsFooter',
  props: {
    message: {
      type: String,
      required: false,
    },
  },
};
</script>
