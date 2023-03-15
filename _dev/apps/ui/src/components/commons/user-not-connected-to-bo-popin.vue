<template>
  <ps-modal
    id="PopinUserNotConnectedToBo"
    v-bind="$attrs"
    hide-footer
    hide-header
    ref="modal"
    @shown="startCountdown"
    @hidden="reload()"
  >
    <b-card
      style=""
      class="card border-0 card-maxwidth-400"
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
  data() {
    return {
      countdown: 15,
    };
  },
  methods: {
    reload() {
      this.$emit('redirectToLoginBo');
    },
    startCountdown() {
      if (this.countdown > 0) {
        setTimeout(() => {
          this.countdown -= 1;
          this.startCountdown();
        }, 1000);
      } else {
        this.reload();
      }
    },
  },
};
</script>
