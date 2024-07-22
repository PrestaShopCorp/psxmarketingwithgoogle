import ModalEcIntro from '@/components/enhanced-conversions/modal-ec-intro.vue';

export default {
  title: 'Enhanced Conversions/Popins',
  component: ModalEcIntro
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ModalEcIntro},
  template: `
    <modal-ec-intro v-bind="$props" ref="modalEcIntro" />
  `,
  beforeMount: () => {
    localStorage.clear();
  },
  mounted: function(this: any) {
    this.$refs.modalEcIntro.$data.displayModal = true;
  }
});

export const EnhancedConversionsIntro:any = Template.bind({});
EnhancedConversionsIntro.args = {
  tosAreSigned: false,
}

