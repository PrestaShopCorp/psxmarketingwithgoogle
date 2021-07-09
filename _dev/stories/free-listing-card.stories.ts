import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'
import FreeListingPopinDisable from '../src/components/free-listing/free-listing-popin-disable.vue'
import {productFeedIsConfigured} from '../.storybook/mock/product-feed';
import {freeListingEnabled, freeListingDisabled, freeListingErrorAPI, freeListingCountryNotEligible} from '../.storybook/mock/free-listing';
import {initialStateApp} from '../.storybook/mock/state-app';

export default {
  title: 'Free listing/Card',
  component: FreeListingCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingCard,FreeListingPopinDisable },
  template: 
  `<div>
    <FreeListingCard v-bind="$props" @openPopin="togglePopinFreeListingDisabled"/>
    <FreeListingPopinDisable ref="PopinFreeListingDisable"/>
  </div>`,
  beforeCreate : args.beforeCreate,
  methods:{
    togglePopinFreeListingDisabled() {
      // @ts-ignore
      this.$bvModal.show(
        // @ts-ignore
        this.$refs.PopinFreeListingDisable.$refs.modal.id,
      );
    },
  },
  beforeMount(this: any) {
    this.$store.state.freeListing = args.initialMcaStatus;
  },
  mounted: args.mounted,

});


export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
  initialMcaStatus: freeListingDisabled,
  beforeCreate(this: any) {
    this.$store.state.productFeed = productFeedIsConfigured
  },
}

export const Enabled:any = Template.bind({});
// TODO : why the card is not reseting when changing story
Enabled.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      this.$store.state.app,
      initialStateApp
    )
  },
  isEnabled: true,
  initialMcaStatus: freeListingEnabled,
  beforeCreate(this: any) {
    this.$store.state.productFeed = productFeedIsConfigured
  },
}

export const AlertEnableFreeListing:any = Template.bind({});
AlertEnableFreeListing.args = {
  isEnabled: true,
  initialMcaStatus: freeListingDisabled,
  beforeCreate(this: any) {
    this.$store.state.productFeed = productFeedIsConfigured
  },
}

// TODO : case to handle (store state, etc...)
// export const AlertCountryNotEligible:any = Template.bind({});
// AlertCountryNotEligible.args = {
//   isEnabled: true,
//   initialMcaStatus: freeListingCountryNotEligible,
//   beforeCreate(this: any) {
//     this.$store.state.productFeed = productFeedIsConfigured
//   },
// }

export const AlertCantEnableFreeListing:any = Template.bind({});
AlertCantEnableFreeListing.args = {
  isEnabled: true,
  initialMcaStatus: freeListingErrorAPI,
  beforeCreate(this: any) {
    this.$store.state.productFeed = productFeedIsConfigured
    // this.$store.state.freeListing = freeListingErrorAPI
  },
}
