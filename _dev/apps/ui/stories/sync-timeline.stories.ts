import SyncTimeline from '../src/components/sync-timeline/sync-timeline.vue';

export default {
  title: 'Basic Components/Synchronization Timeline',
  component: SyncTimeline,
};

const Template = (args, { argTypes }) => ({
  components: {SyncTimeline},
  template: `
    <div>
      <SyncTimeline />
    </div>
  `,
});

export const SynchronizationTimeline:any = Template.bind({});
SynchronizationTimeline.args = {}
