<template>
  <b-alert
    show
    dismissible
    class="ps_gs-alert-timeline"
  >
    <ol class="ps_gs-timeline position-relative justify-content-center">
      <li
        v-for="(step, index) in steps"
        :key="step.title"
        class="ps_gs-timeline-step col px-0"
      >
        <div
          class="ps_gs-timeline-step__link"
        >
          <div
            class="ps_gs-timeline-step__step d-flex align-items-center justify-content-center"
          >
            <span
            >
              {{ index + 1 }}
            </span>
          </div>
          <div class="ps_gs-timeline-step__content">
            <h3
              class="ps_gs-timeline-step__title px-2"
              v-html="step.title"
            />
            <p
              class="ps_gs-timeline-step__subtitle px-2"
              v-html="step.subtitle"
            />
          </div>
        </div>
      </li>
    </ol>
  </b-alert>
</template>
<script>
export default {
  name: 'SyncTimeline',
  data() {
    return {
      steps: [
        {
          title: 'Synchronisation Start',
          subtitle: 'Immediate or later schedule',
        },
        {
          title: 'Product Feed Sync',
          subtitle: 'All active exported to Merchant Center',
        },
        {
          title: 'Google Review',
          subtitle: 'Between 2 to 5 bank days',
        },
        {
          title: 'Synchronisation Complete',
          subtitle: 'If products updated, a new sync will take place',
        },
      ],
    };
  },
};
</script>
