import ModalEcIntro from '@/components/enhanced-conversions/modal-ec-intro.vue';

export default {
  title: 'Enhanced Conversions/Popins',
  component: ModalEcIntro
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ModalEcIntro},
  template: `
    <div>
      <span>ℹ️ If the modal does not appear, empty your local storage.</span>
      <modal-ec-intro v-bind="$props" />
    </div>
  `,
  beforeMount: () => {
    localStorage.clear();
  }
});

export const EnhancedConversionsIntro:any = Template.bind({});
EnhancedConversionsIntro.args = {
  tosAreSigned: false,
}

