<template>
  <ps-modal
    id="PopinUserNotConnectedToBo"
    v-bind="$attrs"
    hide-footer
    hide-header
    ref="modal"
  >
    <b-card
      style="max-width: 40rem"
      class="card border-0"
    >
      <b-card-body align="left">
        <h2
          class="font-weight-600 text-align-center"
        >
          {{ $t('modal.titleDisconnectedUserBo') }}
        </h2>

        <VueShowdown
          class="my-1"
          :markdown="$t('modal.disconnectedUserBo', [countdown])"
        />
        <div align="right">
          <b-button
            @click="reload()"
            class="align-left"
            variant="primary"
          >
            {{ $t('cta.loginPage') }}
          </b-button>
        </div>
      </b-card-body>
    </b-card>
  </ps-modal>
</template>

<script lang="ts">
import PsModal from './ps-modal.vue';

export default {
  name: 'PopinUserNotConnectedToBo',
  components: {
    PsModal,
  },
  props: {
    countdown: {
      type: Number,
      default: 15,
    },
  },
  methods: {
    reload() {
      this.$emit('userClickedOnReload');
    },
  },
};
</script>
