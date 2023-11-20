import AlertEcReady from '@/components/enhanced-conversions/alert-ec-ready.vue';

export default {
  title: 'Enhanced Conversions/Alerts',
  component: AlertEcReady
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AlertEcReady },
  template: `
    <div>
      <alert-ec-ready v-bind="$props" />
    </div>
  `,
});

export const EnhancedConversionsReady:any = Template.bind({});
EnhancedConversionsReady.args = {
  isOnConfigurationPage: false,
}


export const EnhancedConversionsReadyMinimal:any = Template.bind({});
EnhancedConversionsReadyMinimal.args = {
  isOnConfigurationPage: true,
}
