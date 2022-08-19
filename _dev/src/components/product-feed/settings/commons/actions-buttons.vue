<template>
  <div class="d-md-flex text-center justify-content-end mt-3">
    <b-button
      @click="cancel"
      size="sm"
      class="mx-1 mt-3 mt-md-0"
      variant="outline-secondary"
    >
      {{ $t('cta.cancel') }}
    </b-button>
    <b-button
      v-if="previousStep"
      @click="previousStep"
      size="sm"
      class="mx-1 mt-3 mt-md-0"
      variant="outline-secondary"
    >
      {{ $t('cta.previous') }}
    </b-button>

    <span
      v-b-tooltip:psxMktgWithGoogleApp
      :title="
        disableContinue
          ? disableTooltip
          : ''
      "
      :tabindex="disableContinue ? 0 : null"
      class="mx-1"
    >
      <b-button
        data-test-id="continueButton"
        @click="nextStep"
        size="sm"
        :disabled="disableContinue"
        class="mx-0 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ okLabel || $t("cta.saveAndContinue") }}
      </b-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ActionsButtons',
  props: {
    nextStep: {
      type: Function,
      required: true,
    },
    previousStep: {
      type: Function,
      required: false,
      default: null,
    },
    disableContinue: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableTooltip: {
      type: String,
      required: false,
      default: null,
    },
    okLabel: {
      type: String,
      required: false,
      default: null,
    },
  },
  methods: {
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
};
</script>
