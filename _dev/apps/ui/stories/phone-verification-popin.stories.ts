import { rest } from 'msw';
import PhoneVerificationPopin from '../src/components/merchant-center-account/phone-verification/phone-verification-popin.vue';

export default {
  title: 'Merchant Center Account/Popins/Phone Verification',
  component: PhoneVerificationPopin,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PhoneVerificationPopin },
  template: `
    <div>
      <PhoneVerificationPopin v-bind="$props" />
    </div>
  `,
  mounted: args.mounted,
});

export const PhoneVerification:any = Template.bind({});
PhoneVerification.args = {
  visible: true,
};

PhoneVerification.parameters = {
  msw: {
    handlers: [
      rest.post('/merchant-accounts/phone-verification/request-code', (req, res, ctx) => {
        return res(
          ctx.json({
            result: 'code requested',
          })
        );
      }),
    ],
  },
};