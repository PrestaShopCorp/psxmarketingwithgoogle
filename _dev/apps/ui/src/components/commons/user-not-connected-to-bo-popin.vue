<template>
  <ps-modal
    id="PopinUserNotConnectedToBo"
    v-bind="$attrs"
    :title="$t('modal.titleDisconnectedUserBo')"
    @shown="startCountdown"
    hide-header-close
    no-close-on-backdrop
    no-close-on-esc
    ref="modal"
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('modal.disconnectedUserBo', [countdown])"
    />
    <template #modal-footer>
      <b-button
        @click="reload()"
        class="align-left"
        variant="primary"
      >
        {{ $t('cta.loginPage') }}
      </b-button>
    </template>
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
