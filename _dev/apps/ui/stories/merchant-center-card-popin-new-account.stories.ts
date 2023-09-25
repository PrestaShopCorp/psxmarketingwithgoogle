import { rest } from "msw";
import MerchantCenterAccountPopinWebsiteRequirements from "@/components/merchant-center-account/merchant-center-account-popin-website-requirements.vue";
import {
  merchantCenterAccountCreationReady,
  merchantCenterAccountNotConnected,
  merchantCenterAccountWithErrors,
} from "@/../.storybook/mock/merchant-center-account";
import OnboardingPage from "@/views/onboarding-page.vue";
import { initialStateApp } from "@/../.storybook/mock/state-app";
import cloneDeep from "lodash.clonedeep";
import contextPsAccountsConnectedAndValidated from "@/../.storybook/mock/ps-accounts";
import googleAccountConnected from "@/../.storybook/mock/google-account";
import { contextPsEventBus } from "@/../.storybook/mock/ps-event-bus";
import { State } from "../src/store/modules/accounts/state";

export default {
  title: "Merchant Center Account/Popins/Website Requirements",
  component: MerchantCenterAccountPopinWebsiteRequirements,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountPopinWebsiteRequirements, OnboardingPage },
  template: `
    <div>
      <OnboardingPage />
      <MerchantCenterAccountPopinWebsiteRequirements v-bind="$props" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.app = Object.assign(
      {},
      // this.$store.state.app,
      initialStateApp,
      { psxMktgWithGoogleStoreSettingsUrl: "https://www.perdu.com" },
    );
    window.contextPsAccounts = cloneDeep(
      contextPsAccountsConnectedAndValidated,
    );
    window.contextPsEventBus = cloneDeep(contextPsEventBus);
    this.$store.state.accounts.contextPsAccounts = cloneDeep(
      contextPsAccountsConnectedAndValidated,
    );
    this.$store.state.accounts.googleAccount = cloneDeep(
      googleAccountConnected,
    );
    this.$store.state.accounts.googleMerchantAccount = cloneDeep(
      merchantCenterAccountNotConnected,
    );
  },
  beforeMount: args.beforeMount,
  mounted: args.mounted,
});

export const StepRequirements: any = Template.bind({});
StepRequirements.args = {
  visible: true,
  stepActive: 1,
  newMca: true,
};

export const StepStoreInfo: any = Template.bind({});
StepStoreInfo.args = {
  visible: true,
  stepActive: 2,
  newMca: true,
  beforeMount(this: any) {
    const state: State = this.$store.state.accounts;
    state.googleMerchantAccount = cloneDeep(merchantCenterAccountCreationReady);
  },
};
StepStoreInfo.parameters = {
  attemps: 10,
  msw: {
    handlers: [
      rest.post("/merchant-accounts/", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            result: "created",
            account_id: "588456953",
            aggregator_id: "388403106",
          }),
        );
      }),
      rest.get("/merchant-accounts/588456953", (req, res, ctx) => {
        StepStoreInfo.parameters.attemps -= 1;
        if (StepStoreInfo.parameters.attemps > 0) {
          return res(
            ctx.status(404),
            ctx.text('Mock: Account not created yet'),
          );
        }
        return res(
          ctx.status(200),
          ctx.json({
            aggregatorId: "4106",
            name: "Some Shop",
            websiteUrl: "https://www.perdu.com",
            adultContent: false,
            users: [
              {
                emailAddress: "doge@the.dog",
                admin: false,
                reportingManager: true,
              },
            ],
            id: "588456953",
            businessInformation: {
              address: {
                streetAddress: "🤷‍♂️",
                locality: "🤷‍♂️",
                postalCode: "🤷‍♂️",
                country: "FR",
              },
              phoneNumber: "+33102030405",
              phoneVerificationStatus: "VERIFIED",
            },
            automaticImprovements: {
              itemUpdates: {
                effectiveAllowPriceUpdates: true,
                effectiveAllowAvailabilityUpdates: true,
                effectiveAllowStrictAvailabilityUpdates: true,
                effectiveAllowConditionUpdates: true,
              },
              imageImprovements: {
                effectiveAllowAutomaticImageImprovements: true,
              },
              shippingImprovements: {
                allowShippingImprovements: false,
              },
            },
            adsLinks: [
              {
                adsId: "562782011139",
                status: "active",
              },
            ],
            accountManagement: "manual",
            subAccountNotManagedByPrestashop: false,
          }),
        );
      }),
    ],
  },
};

export const StepStoreInfoWithErrors: any = Template.bind({});
StepStoreInfoWithErrors.args = {
  visible: true,
  stepActive: 2,
  newMca: true,
  mounted(this: any) {
    setTimeout(() => {
      this.$store.state.accounts.googleMerchantAccount = cloneDeep(
        merchantCenterAccountWithErrors,
      );
    }, 2000);
  },
};

export const CheckRequirements: any = Template.bind({});
CheckRequirements.args = {
  visible: true,
  newMca: false,
};
