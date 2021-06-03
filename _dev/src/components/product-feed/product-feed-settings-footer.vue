<template>
  <div
    class="text-muted ps_gs-fz-12 mb-0 mt-2
    d-flex align-items-start align-items-sm-center justify-content-end"
  >
    <b-button
      v-b-tooltip
      title="Tooltip!"
      variant="invisible"
      class="ml-1 p-0 border-0 ps_gs-fz-12 text-muted"
    >
      <span class="material-icons-round mr-1 ps_gs-fz-12 align-middle">
        error_outline
      </span>
      <span class="sr-only">Tooltip!</span>
    </b-button>
    <p>
      {{ $t("productFeedSettings.noticeDataStored") }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'ProductFeedSettingsFooter',
};
</script>
