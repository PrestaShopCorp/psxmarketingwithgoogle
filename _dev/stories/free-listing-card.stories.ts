import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'
import FreeListingPopinDisable from '../src/components/free-listing/free-listing-popin-disable.vue'
import {productFeedIsConfigured} from '../.storybook/mock/product-feed';
import {freeListingEnabled, freeListingDisabled, freeListingErrorAPI} from '../.storybook/mock/free-listing';
import cloneDeep from 'lodash.clonedeep';

export default {
  title: 'Free listing/Card',
  component: FreeListingCard,
  parameters: {
    jest: ['free-listing-card.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingCard,FreeListingPopinDisable },
  template:
  `<div>
    <FreeListingCard v-bind="$props" @openPopin="togglePopinFreeListingDisabled"/>
    <FreeListingPopinDisable ref="PopinFreeListingDisable"/>
  </div>`,
  beforeMount : args.beforeMount,
  methods:{
    togglePopinFreeListingDisabled() {
      // @ts-ignore
      this.$bvModal.show(
        // @ts-ignore
        this.$refs.PopinFreeListingDisable.$refs.modal.id,
      );
    },
  },
});


export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedIsConfigured);
  },
}

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedIsConfigured);
    this.$store.state.freeListing = cloneDeep(freeListingEnabled);
  },
}

export const AlertEnableFreeListing:any = Template.bind({});
AlertEnableFreeListing.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedIsConfigured)
    this.$store.state.freeListing = cloneDeep(freeListingDisabled);
  },
}

export const AlertCantEnableFreeListing:any = Template.bind({});
AlertCantEnableFreeListing.args = {
  isEnabled: true,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedIsConfigured);
    this.$store.state.freeListing = cloneDeep(freeListingErrorAPI);
  },
}

// Disabled.parameters = {
//   jest: ['free-listing-card.spec.ts'],
// };
