import InputTextWithTag from '../src/components/commons/input-text-with-tag.vue';

export default {
  title: 'Basic Components/InputTextTag',
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    InputTextWithTag,
  },
  template: `
    <div style="max-width: 400px">
      <InputTextWithTag v-bind="$props" />
    </div>
  `,
});

export const InputTextTag:any = Template.bind({});
InputTextTag.args = {
  hasError: true
}

