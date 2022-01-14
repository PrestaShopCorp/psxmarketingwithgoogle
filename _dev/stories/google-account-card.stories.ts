import GoogleAccountCard from '../src/components/google-account/google-account-card.vue'
import GoogleAccountPopinDisconnect from '../src/components/google-account/google-account-popin-disconnect.vue';
import {
  googleAccountConnected,
  googleAccountNotConnectedButAuthenticationUrlOK,
  googleAccountFailedToRetrieveAuthenticationUrl,
  googleAccountFailedToRetrieveToken,
  googleAccountMissingTokenScopes,
} from "../.storybook/mock/google-account";

import {rest} from 'msw';

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
  loading: false,
  isEnabled: false,
};

export const NotConnectedAndCanNotGetAuthenticationUrl:any = Template.bind({});
NotConnectedAndCanNotGetAuthenticationUrl.args = {
  loading: false,
  isEnabled: true,
  user: Object.assign({}, googleAccountFailedToRetrieveAuthenticationUrl),
};

NotConnectedAndCanNotGetAuthenticationUrl.parameters = {
  msw: {
    handlers: [
      rest.get('/oauth', (req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({
            "statusCode": 404,
            "message": "Google account not found!",
            "error": "{\"shopId\":\"foobar\",\"correlationId\":\"foobar2\"}"
          })
        );
      }),
      rest.get('/oauth/authorized-url', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
    ],
  },
};

export const NotConnected:any = Template.bind({});
NotConnected.args = {
  isEnabled: true,
  loading: false,
  user: Object.assign({}, googleAccountNotConnectedButAuthenticationUrlOK),
};

NotConnected.parameters = {
  msw: {
    handlers: [
      rest.get('/oauth', (req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({
            "statusCode": 404,
            "message": "Google account not found!",
            "error": "{\"shopId\":\"foobar\",\"correlationId\":\"foobar2\"}"
          })
        );
      }),
      rest.get('/oauth/authorized-url', (req, res, ctx) => {
        return res(
          ctx.json({
            "authorizedUrl": "https://accounts.google.com/o/oauth2/v2/auth?foobar"
          })
        );
      }),
    ],
  },
};

export const Connecting:any = Template.bind({});
Connecting.args = {
  loading: false,
  isEnabled: true,
  user: Object.assign({}, googleAccountNotConnectedButAuthenticationUrlOK),
  mounted() {
    this.$refs.googleAccountCard.$data.isConnecting = true;
  },
};

export const CouldNotConnect:any = Template.bind({});
CouldNotConnect.args = {
  isEnabled: true,
  loading: false,
  user: Object.assign({}, googleAccountFailedToRetrieveToken),
};

export const Connected:any = Template.bind({});
Connected.args = {
  isEnabled: true,
  loading: false,
  user: Object.assign({}, googleAccountConnected),
};

export const missingTokenScopes:any = Template.bind({});
missingTokenScopes.args = {
  loading: false,
  isEnabled: true,
  user: Object.assign({}, googleAccountMissingTokenScopes),
  mounted: function(this: any) {
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountMissingTokenScopes);
  }
};
