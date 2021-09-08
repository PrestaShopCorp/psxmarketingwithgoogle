<template>
    <b-card
      header-class="d-flex justify-content-between align-items-center px-3"
      body-class="p-3"
    >
      <template #header>
        <p class="ps_gs-onboardingcard__title mb-0">
          Key metrics
        </p>
        <b-button-group size="sm">
          <b-button
            variant="default"
            class="rounded-0"
          >
            Yesterday
          </b-button>
          <b-button
            variant="default"
            class="rounded-0"
          >
            Last 7 days
          </b-button>
          <b-button
            variant="default"
            class="rounded-0"
          >
            Last 30 days
          </b-button>
          <b-button
            variant="default"
            class="rounded-0"
          >
            3 months
          </b-button>
        </b-button-group>
      </template>
      <div class="mt-2 d-flex justify-content-between">
        <div>
          <h3 class="ps_gs-fz-20 font-weight-600 mb-1">
            Account performance
          </h3>
          <p>
            Check out these amazing numbers
          </p>
        </div>
        <div>
          <b-button
            variant="primary"
          >
            {{ $t('cta.createCampaign') }}
          </b-button>
        </div>
      </div>
    </b-card>
</template>

<script>
export default {
  name: 'KeyMetricsCard'
}
</script>
