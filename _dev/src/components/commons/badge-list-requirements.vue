<template>
  <div
    class="d-flex pt-2"
  >
    <span class="material-icons-round mr-2 mb-0 ps_gs-fz-16 align-self-center">
      error_outline
    </span>
    <ul class="list-inline mb-0">
      <li
        v-for="badge in badges"
        :key="badge.name"
        class="list-inline-item"
      >
        <b-button
          variant="invisible"
          class="m-0 p-0"
          v-b-tooltip:psxMktgWithGoogleApp
          :title="$t(`tooltip.${badge}Required`)"
        >
          <b-badge variant="muted">
            {{ $t(`badge.${badge}`) }}
          </b-badge>
        </b-button>
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
    isEnabled: {
      type: Boolean,
    },
  },
};
</script>
