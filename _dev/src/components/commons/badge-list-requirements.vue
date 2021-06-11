<template>
  <div
      v-if="!isEnabled"
      class="d-flex pt-2"
  >
    <span class="material-icons-round mr-2 mb-0 ps_gs-fz-16 align-self-center">
      error_outline
    </span>
    <ul class="list-inline mb-0">
      <li
        v-for="badge in badges"
        :key="badge.name"
        v-b-tooltip:googleShoppingApp
        :title="$t(`tooltip.${badge}Required`)"
        class="list-inline-item"
      >
        <b-badge variant="muted">
        {{ $t(`badge.${badge}`) }}
        </b-badge>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BadgeListRequirements',
  props: {
    badges: {
      type: Array,
    },
  },
};
</script>
