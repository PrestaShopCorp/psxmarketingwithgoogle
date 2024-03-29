import MultiSelectValue from "../src/components/commons/multi-select-value.vue";

export default {
  title: 'Basic Components/MultiSelect',
  component: MultiSelectValue,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MultiSelectValue },
  template:
    '<div><MultiSelectValue v-bind="$props" /></div>'
});

export const MultiSelect: any = Template.bind({});
MultiSelect.args = {
  dropdownOptions: ["Black", "White", "Red", "Blue", "Green", "Yellow"],
};