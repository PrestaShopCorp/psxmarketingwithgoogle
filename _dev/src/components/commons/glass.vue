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
      <p>
        Can't see Google secured browser?<br>
        Hit Continue to relaunch the window and finish configuration.
      </p>
      <p>
        You may need to activate popups in your browser to continue.
      </p>
      <b-button
        class="ps_gs-glass__button mt-3"
        variant="outline"
      >
        Continue
      </b-button>
    </div>
    <b-button
      class="ps_gs-glass__close p-3 m-2"
      variant="text"
    >
      <i class="material-icons">close</i>
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'Glass'
}
</script>
