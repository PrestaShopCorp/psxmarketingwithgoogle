<template>
  <b-card
    class="mb-2 shadow-sm border-0"
    style="max-width: 40rem"
  >
    <b-card-body align="center">
      <h3 class="font-weight-600">
        {{ $t("configuredState.title") }}
      </h3>

      <b-img
        :src="require('@/assets/images/configured.png')"
        fluid
      />
      <VueShowdown :markdown="$t('configuredState.text')" />
      <template>
        <ul
          class="timeline-configured list-unstyled mb-auto"
        >
          <VueShowdown
            v-for="(oneStep, index) in steps"
            :key="index"
            tag="li"
            :markdown="oneStep"
            class="timeline-configured__item"
          />
        </ul>
      </template>
      <b-button
        class="mt-4"
        :to="{ name: 'campaign-creation' }"
        variant="primary"
      >
        {{ $t("configuredState.cta") }}
      </b-button>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  data() {
    return {
      steps: [
        this.$i18n.t('configuredState.firstStep'),
        this.$i18n.t('configuredState.secondStep'),
        this.$i18n.t('configuredState.thirdStep'),
        this.$i18n.t('configuredState.fourthStep'),
        this.$i18n.t('configuredState.fifthStep'),
        this.$i18n.t('configuredState.sixthStep'),
      ],
    };
  },
};
</script>
