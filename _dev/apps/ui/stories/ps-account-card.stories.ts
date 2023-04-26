import { cloneDeep } from 'lodash';
import {
  contextPsAccountsNotConnected,
  contextPsAccountsConnected,
  contextPsAccountsConnectedAndValidated,
} from '../.storybook/mock/ps-accounts';

export default {
  title: 'PS Account/Card',
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: '<prestashop-accounts />',
  mounted: args.mounted,
});

const initAccountsComponent = () => {
  if (!window.psaccountsVue) {
    return;
  }
  window.psaccountsVue.init();
};

export const NotConnected:any = Template.bind({});
NotConnected.args = {
  mounted: function () {
    window.contextPsAccounts = cloneDeep(contextPsAccountsNotConnected),
    initAccountsComponent();
    window.addEventListener('load', () => {
      initAccountsComponent();
    });
  }
}

export const Connected:any = Template.bind({});
Connected.args = {
  mounted: function () {
    window.contextPsAccounts = cloneDeep(contextPsAccountsConnected),
    initAccountsComponent();
    window.addEventListener('load', () => {
      initAccountsComponent();
    });
  }
}

export const ConnectedAndValidated:any = Template.bind({});
ConnectedAndValidated.args = {
  mounted: function () {
    window.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated),
    initAccountsComponent();
    window.addEventListener('load', () => {
      initAccountsComponent();
    });
  }
}
