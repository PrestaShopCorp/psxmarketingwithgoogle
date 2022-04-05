<template>
  <b-alert
    :show="!timelineAlertIsHidden"
    dismissible
    class="ps_gs-alert-timeline"
    @dismissed="saveAlertVisibility"
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
            <span>
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
          title: this.$i18n.t('syncTimeline.title1'),
          subtitle: this.$i18n.t('syncTimeline.subtitle1'),
        },
        {
          title: this.$i18n.t('syncTimeline.title2'),
          subtitle: this.$i18n.t('syncTimeline.subtitle2'),
        },
        {
          title: this.$i18n.t('syncTimeline.title3'),
          subtitle: this.$i18n.t('syncTimeline.subtitle3'),
        },
        {
          title: this.$i18n.t('syncTimeline.title4'),
          subtitle: this.$i18n.t('syncTimeline.subtitle4'),
        },
        {
          title: this.$i18n.t('syncTimeline.title5'),
          subtitle: this.$i18n.t('syncTimeline.subtitle5'),
        },
      ],
    };
  },
  computed: {
    timelineAlertIsHidden() {
      return JSON.parse(localStorage.getItem('timelineAlertIsHidden'));
    },
  },
  methods: {
    saveAlertVisibility() {
      localStorage.setItem('timelineAlertIsHidden', true);
    },
  },
};
</script>
