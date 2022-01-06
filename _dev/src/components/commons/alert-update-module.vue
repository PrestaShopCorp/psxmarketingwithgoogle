<template>
  <b-alert
    variant="warning"
    class="mb-0 mt-3"
    show
  >
    <VueShowdown
      tag="p"
      :extensions="['no-p-tag']"
      class="mb-0"
      :markdown="alert.text"
    />
    <div
      class="d-md-flex text-center align-items-center mt-2"
    >
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0 md-4 mr-md-1"
        variant="primary"
        target="_blank"
        @click="$emit('moduleUpdated',alert.module)"
      >
        <span v-if="loading">
          <span class="icon-busy icon-busy--dark" />
        </span>
        <span
          v-else
        >
          {{ $t('cta.update') }}
        </span>
      </b-button>
    </div>
  </b-alert>
</template>

<script>
export default {
  name: 'AlertUpdateModule',
  props: {
    loading: {
      type: Boolean,
      default: false,
      required: true,
    },
    alertIs: {
      type: String,
      default: null,
      required: true,
    },
    eventBusVersion: {
      type: Object,
      required: true,
    },
    psxmarketingwithgoogleVersion: {
      type: Object,
      required: true,
    },
  },

  computed: {
    alert() {
      if (this.alertIs === 'eventbus') {
        return {
          text: this.$i18n.t('general.eventBusMustbeUpdated'),
          module: this.eventBusVersion,
        };
      }
      return {
        text: this.$i18n.t('general.psxmarketingwithgoogleMustBedUpdated'),
        module: this.psxmarketingwithgoogleVersion,
      };
    },
  },

};
</script>
