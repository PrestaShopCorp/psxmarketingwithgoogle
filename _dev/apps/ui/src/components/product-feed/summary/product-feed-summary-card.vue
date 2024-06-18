<template>
  <article class="product-feed-summary-card">
    <header class="product-feed-summary-card__header">
      <span class="product-feed-summary-card__title">
        <slot name="title" />
      </span>
      <b-link
        v-if="linkTo"
        @click="goTo(linkTo)"
        :title="$t('cta.editSettings')"
        class="product-feed-summary-card__link"
      >
        <span class="material-icons">
          edit
        </span>
      </b-link>
    </header>
    <div class="product-feed-summary-card__content">
      <slot />
    </div>
  </article>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'ProductFeedSummaryCards',
  props: {
    linkTo: {
      type: Object,
      required: false,
      default: () => null,
    },
  },
  methods: {
    goTo(link) {
      this.$router.push({
        name: link.name,
        params: {
          step: link.params,
        },
      });
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', link.step);
    },
  },
});
</script>
