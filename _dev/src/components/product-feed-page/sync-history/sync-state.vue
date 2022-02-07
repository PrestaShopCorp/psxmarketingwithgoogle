<template>
  <li
    class="sync-history__item sync-history__item--icon-check sync-history__item--bg-blue"
    :class="{
      ['sync-history__item--icon-' + icon]: true,
      ['sync-history__item--bg-' + lineColor]: lineColor.length > 1,
    }"
  >
    <div>
      <h3 class="sync-history__item-title">
        {{ title }}
      </h3>
      <span class="sync-history__item-description">
        {{ description }}
      </span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
      validator(icon) {
        // see _dev/src/assets/scss/components/_sync-history.scss for available icons
        return ['check_circle', 'schedule', 'cancel', 'change_circle'].indexOf(icon) !== -1;
      },
    },
    lineColor: {
      type: String,
      required: false,
      default: '',
      validator(lineColor) {
        // see _dev/src/assets/scss/components/_sync-history.scss for available colors
        return ['danger', 'info', ''].indexOf(lineColor) !== -1;
      },
    },
  },
};
</script>
