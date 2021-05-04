import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'

export default {
  title: 'Free listing/Card',
  component: FreeListingCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FreeListingCard },
  template: '<FreeListingCard v-bind="$props" />',
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
}

export const Enabled:any = Template.bind({});
Enabled.args = {
  isEnabled: true,
}

export const AlertActivationSuccess:any = Template.bind({});
AlertActivationSuccess.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: true,
  alert: {
    variant: 'success',
    text: 'alertActivationSuccess',
  },
}

export const AlertEnableFreeListing:any = Template.bind({});
AlertEnableFreeListing.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: false,
  alert: {
    variant: 'warning',
    text: 'alertEnableFreeListing',
  },
}

export const AlertProductFeedDisabled:any = Template.bind({});
AlertProductFeedDisabled.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: true,
  alert: {
    variant: 'warning',
    text: 'alertProductFeedDisabled',
  },
}

export const AlertEnableFreeListingAndProductFeed:any = Template.bind({});
AlertEnableFreeListingAndProductFeed.args = {
  isEnabled: true,
  firstTime: false,
  enabledFreeListing: false,
  alert: {
    variant: 'warning',
    text: 'alertEnableFreeListingAndProductFeed',
  },
}
