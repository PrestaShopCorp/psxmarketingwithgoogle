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
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
  },
}

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
    this.$store.state.freeListing.status = true;
  },
}

export const AlertEnableFreeListing:any = Template.bind({});
AlertEnableFreeListing.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
  },
}

// TODO : case to handle (store state, etc...)
export const AlertCountryNotEligible:any = Template.bind({});
AlertCountryNotEligible.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
  },
}

// ! Add BIG warning: not developed yet
AlertCountryNotEligible.decorators = [() => ({
  template: `
    <div>
      <h2>
        ⚠️ TODO: Handle state, this story isn't developed yet ⚠️
      </h2>
      <story />
    </div>
  `
})];


export const AlertCantEnableFreeListing:any = Template.bind({});
AlertCantEnableFreeListing.args = {
  isEnabled: true,
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedIsConfigured);
    this.$store.state.freeListing.errorAPI = true;
  },
}
