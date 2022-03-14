<template>
  <b-card
    class="mb-2 shadow-sm border-0"
    style="max-width: 40rem"
  >
    <b-card-body align="center">
      <h3 class="font-weight-600">
        {{ $t("configuredState.title") }}
      </h3>
      <img
        src="@/assets/images/configured.png"
        alt=""
      >
      <p>
        {{ $t("configuredState.text") }}
      </p>
      <template>
        <ul
          class="timeline-configured list-unstyled mb-auto"
          v-for="(oneStep, index) in steps"
          :key="index"
        >
          <li
            class="timeline-configured__item"
            :class="{
              'timeline-configured__item--bg-green': index < steps.length - 1,
              'timeline-configured__item--icon-check_circle':
                index < steps.length - 1,
              'timeline-configured__item--icon-play_circle':
                index === steps.length - 1,
            }"
          >
            {{ oneStep }}
          </li>
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
