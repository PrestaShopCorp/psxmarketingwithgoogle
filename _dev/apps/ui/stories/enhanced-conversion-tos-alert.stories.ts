import AlertSignGadsTos from '@/components/enhanced-conversions/alert-sign-gads-tos.vue';

export default {
  title: 'Enhanced Conversions/Alerts',
  component: AlertSignGadsTos
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AlertSignGadsTos },
  template: `
    <div>
      <alert-sign-gads-tos v-bind="$props" />
    </div>
  `,
});

export const TermsOfServicesToSign:any = Template.bind({});
TermsOfServicesToSign.args = {
}
