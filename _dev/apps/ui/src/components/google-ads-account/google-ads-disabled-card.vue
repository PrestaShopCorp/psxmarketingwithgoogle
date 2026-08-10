<template>
  <section class="card ps_gs-onboardingcard p-3 mb-3 ps_gs-onboardingcard--disabled">
    <h2 class="h4 mb-2">
      {{ $t('tinyLuxGoogle.adsTitle') }}
    </h2>
    <p class="mb-0">
      {{ $t('tinyLuxGoogle.developerTokenRequired') }}
    </p>
  </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'GoogleAdsDisabledCard',
});
</script>
