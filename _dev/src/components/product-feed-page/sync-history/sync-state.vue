<template>
  <li
    class="sync-history__item sync-history__item--bg-blue"
    :class="{
      ['sync-history__item--icon-' + syncState.icon]: true,
      ['sync-history__item--bg-' + syncState.lineColor]:
        syncState.lineColor && syncState.lineColor.length > 1,
    }"
  >
    <div>
      <h3 class="sync-history__item-title">
        {{ syncState.title }}
      </h3>
      <span
        v-if="syncState.description"
        class="sync-history__item-description"
      >
        {{ syncState.description }}
      </span>
    </div>
  </li>
</template>

<script>
import {
  SyncHystoryIcons,
  syncHystoryLineColors,
} from '@/enums/product-feed/sync-history.ts';

export default {
  props: {
    syncState: {
      type: Object,
      required: true,
      validator(obj) {
        const titleValidator = typeof (obj.title) === 'string';
        const descriptionValidator = typeof (obj.description) === 'string'
          || typeof (obj.description) === 'undefined';
        const iconValidator = Object.values(SyncHystoryIcons).includes(obj.icon);
        let lineColorValidator = false;

        if (typeof (obj.lineColor) === 'undefined'
          || Object.values(syncHystoryLineColors).includes(obj.lineColor)) {
          lineColorValidator = true;
        }
        return titleValidator && descriptionValidator && iconValidator && lineColorValidator;
      },
    },
  },
};
</script>
