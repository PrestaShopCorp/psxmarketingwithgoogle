import GoogleAccountCard from '../src/components/google-account/google-account-card.vue'
import GoogleAccountPopinDisconnect from '../src/components/google-account/google-account-popin-disconnect.vue';

export default {
  title: 'Google Account/Card',
  component: {
    GoogleAccountCard,
    GoogleAccountPopinDisconnect,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GoogleAccountCard, GoogleAccountPopinDisconnect },
  template: `
    <div>
      <p>
        ⚠️ Known limitation: Confirming the dissociation of the account
        has no impact in this story.
      </p>
      <GoogleAccountCard
        v-bind="$props"
        @dissociateGoogleAccount="onGoogleAccountDissociationRequest"
      />
      <GoogleAccountPopinDisconnect
        ref="googleAccountDisconnectModal"
      />
    </div>`,
  methods: {
    onGoogleAccountDissociationRequest() {
      // @ts-ignore
      this.$bvModal.show(
        // @ts-ignore
        this.$refs.googleAccountDisconnectModal.$refs.modal.id,
      );
    },
  },
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
  isConnected: false,
};

export const NotConnected:any = Template.bind({});
NotConnected.args = {
  isEnabled: true,
  isConnected: false,
};

export const Connected:any = Template.bind({});
Connected.args = {
  isEnabled: true,
  isConnected: true,
};
