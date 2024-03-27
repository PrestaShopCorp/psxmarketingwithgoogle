import InputTextWithTag from '../src/components/commons/input-text-with-tag.vue';

export default {
  title: 'Basic Components/Input Text With Tag',
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    InputTextWithTag,
  },
  template: `
    <div style="max-width: 400px">
      <InputTextWithTag :has-error="hasError" />
    </div>
  `,
});

export const Basics:any = Template.bind({});
Basics.args = {
  hasError: true
}

