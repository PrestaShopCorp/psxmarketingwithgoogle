<template>
  <div
    class="ps_gs-glass"
  >
    <div class="ps_gs-glass__content">
      <figure class="ps_gs-glass__img">
        <img
          src="@/assets/images/google-icon.svg"
          width="48"
          height="48"
          alt="Google logo"
        >
      </figure>
      <VueShowdown
        :markdown="$t('glass.message')"
      />
      <b-button
        class="ps_gs-glass__button mt-3"
        variant="outline-secondary"
        size="sm"
        @click="forceFocus"
      >
        {{ $t('cta.continue') }}
      </b-button>
    </div>
    <b-button
      class="ps_gs-glass__close p-3 m-2"
      variant="text"
      @click="closePopup"
    >
      <i class="material-icons">close</i>
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'PopupGlass',
  methods: {
    closePopup() {
      this.$emit('close');
    },
    forceFocus() {
      this.$emit('forceFocus');
    },
  },
};
</script>
