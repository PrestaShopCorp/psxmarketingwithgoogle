import GoogleAccountCard from '../src/components/google-account/google-account-card.vue'
import GoogleAccountPopinDisconnect from '../src/components/google-account/google-account-popin-disconnect.vue';
import {
  googleAccountConnected,
  googleAccountNotConnectedButAuthenticationUrlOK,
  googleAccountFailedToRetrieveAuthenticationUrl,
  googleAccountFailedToRetrieveToken,
} from "../.storybook/mock/google-account";

export default {
  title: 'Google Account/Card',
  component: {
    GoogleAccountCard,
    GoogleAccountPopinDisconnect,
  },
  parameters: {
    jest: ['google-account-card.spec.ts'],
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
        ref="googleAccountCard"
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
  mounted: args.mounted,
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
};

export const NotConnectedAndNoAuthenticationUrlYet:any = Template.bind({});
NotConnectedAndNoAuthenticationUrlYet.args = {
  isEnabled: true,
};

export const NotConnectedAndCanNotGetAuthenticationUrl:any = Template.bind({});
NotConnectedAndCanNotGetAuthenticationUrl.args = {
  isEnabled: true,
  user: Object.assign({}, googleAccountFailedToRetrieveAuthenticationUrl),
};

export const NotConnected:any = Template.bind({});
NotConnected.args = {
  isEnabled: true,
  user: Object.assign({}, googleAccountNotConnectedButAuthenticationUrlOK),
};

export const Connecting:any = Template.bind({});
Connecting.args = {
  isEnabled: true,
  user: Object.assign({}, googleAccountNotConnectedButAuthenticationUrlOK),
  mounted() {
    this.$refs.googleAccountCard.$data.isConnecting = true;
  },
};

export const CouldNotConnect:any = Template.bind({});
CouldNotConnect.args = {
  isEnabled: true,
  user: Object.assign({}, googleAccountFailedToRetrieveToken),
};

export const Connected:any = Template.bind({});
Connected.args = {
  isEnabled: true,
  user: Object.assign({}, googleAccountConnected),
};
