<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
  >
    <div
      class="d-md-flex flex-wrap align-items-center justify-content-between"
    >
      <div class="d-flex align-items-center">
        <img
          class="mr-3 rounded-circle"
          :src="isConnected ? '//source.unsplash.com/40x40'
            : require('@/assets/images/puffin-logo.svg')"
          width="40"
          height="40"
          alt=""
        >
        <b-card-text class="flex-grow-1 text-left mb-0">
          {{ message }}
          <strong
            v-if="isConnected"
            class="d-md-block"
          >
            Vincent Godard
          </strong>
        </b-card-text>
      </div>
      <div
        class="mx-auto d-flex-md mr-md-0 flex-md-shrink-0 text-center"
      >
        <b-button
          size="sm"
          v-if="!isConnected"
          class="mx-1 mt-3 mt-md-0 mr-md-0"
          variant="primary"
        >
          {{ $t('cta.connect') }}
        </b-button>

        <template v-else>
          <b-button
            size="sm"
            variant="outline-secondary"
            class="mx-1 mt-3 mt-md-0"
            target="_blank"
          >
            {{ $t('cta.dissociate') }}
          </b-button>
          <b-button
            size="sm"
            variant="outline-secondary"
            class="mx-1 mt-3 mt-md-0 mr-md-0"
            target="_blank"
          >
            {{ $t('cta.manageAccount') }}
          </b-button>
        </template>
      </div>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'PsAccountCard',
  props: {
    isConnected: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    message() {
      /**
       * * I'm using this.$i18n.t('') instead of $t('')
       * * Without this change, it wouldn't work in Storybook
       */
      return this.isConnected
        ? this.$i18n.t('psAccountCard.onboardedText')
        : this.$i18n.t('psAccountCard.disonboardedText');
    },
  },
};
</script>
