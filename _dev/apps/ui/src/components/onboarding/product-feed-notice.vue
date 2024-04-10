<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard ps_gs-onboardingcard--muted p-3"
  >
    <p class="mb-1 px-2">
      {{ $t('onboarding.productFeedNotice') }}
    </p>
    <a
      target="_blank"
      class="text-muted ps_gs-fz-12 px-2"
      :href="$options.googleUrl.learnAboutFreeListing"
    >
      {{ $t('cta.learnAboutFreeListing') }}
    </a>
  </b-card>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';

export default {
  name: 'ProductFeedNotice',
  googleUrl,
};
</script>
