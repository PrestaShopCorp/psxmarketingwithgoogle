<template>
  <b-card
    class="mb-2 maxw-sm-272 shadow-sm border-0"
  >
    <b-card-body
      align="center"
    >
      <h3
        class="font-weight-600"
      >
        {{ $t('notConfiguredState.title') }}
      </h3>
      <img
        src="@/assets/images/coaching.svg"
        alt=""
      >
      <p>
        {{ $t('notConfiguredState.text') }}
      </p>
      <b-button
        :to="{name: 'configuration'}"
        variant="primary"
      >
        {{ $t('notConfiguredState.cta') }}
      </b-button>
    </b-card-body>
  </b-card>
</template>

<script>
export default {

};
</script>
