import { cloneDeep } from 'lodash';
import psAccountsVue from 'prestashop_accounts_vue_components';
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

export const NotConnected:any = Template.bind({});
NotConnected.args = {
  mounted: function () {
    window.contextPsAccounts = cloneDeep(contextPsAccountsNotConnected),
    psAccountsVue.init();
  }
}

export const Connected:any = Template.bind({});
Connected.args = {
  mounted: function () {
    window.contextPsAccounts = cloneDeep(contextPsAccountsConnected),
    psAccountsVue.init();
  }
}

export const ConnectedAndValidated:any = Template.bind({});
ConnectedAndValidated.args = {
  mounted: function () {
    window.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated),
    psAccountsVue.init();
  }
}
