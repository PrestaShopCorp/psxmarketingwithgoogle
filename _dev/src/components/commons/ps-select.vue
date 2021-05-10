<script>
import vSelect from 'vue-select';
import Deselect from './ps-select-deselect';
import OpenIndicator from './ps-select-open-indicator';

export default {
  name: 'PsSelect',
  extends: vSelect,
  /**
   * As I'm extending a component, I don't want to overwrite props type
   * That's why I'm disabling this specific eslint rule
   */
  /* eslint-disable vue/require-prop-types */
  props: {
    components: {
      default: () => ({OpenIndicator, Deselect}),
    },
  },
  /* eslint-enable vue/require-prop-types */
};
</script>
