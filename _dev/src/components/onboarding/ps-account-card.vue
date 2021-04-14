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
          :src="isConnected ? '//source.unsplash.com/40x40' : require('@/assets/images/puffin-logo.svg')"
          width="40"
          height="40"
        />
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
          v-if="!isConnected"
          variant="primary"
          class="mx-2 mt-3 mt-md-0 mr-md-0"
        >
          Connect
        </b-button>

        <template v-else>
          <b-button
            variant="outline-secondary"
            class="mx-2 mt-3 mt-md-0"
            target="_blank"
          >
            Dissociate
          </b-button>
          <b-button
            variant="outline-secondary"
            class="mx-2 mt-3 mt-md-0 mr-md-0"
            target="_blank"
          >
            Manage account
          </b-button>
        </template>
      </div>
    </div>
  </b-card>
</template>

<script>
import { BIconstack, BIconCheck, BIconCircleFill } from "bootstrap-vue";

export default {
  name: "PsAccountCard",
  components: {
    BIconstack,
    BIconCheck,
    BIconCircleFill,
  },
  props: {
    isConnected: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    message: function() {
      return this.isConnected ? 'Your shop is associated to the PrestaShop account of' : 'Authorize your account to manage your shop’s services'
    }
  }
};
</script>
