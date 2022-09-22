import {PsAccounts} from 'prestashop_accounts_vue_components';
import {
  contextPsAccountsNotConnected,
  contextPsAccountsConnected,
  contextPsAccountsConnectedAndValidated,
} from '../.storybook/mock/ps-accounts';

export default {
  title: 'PS Account/Card',
  component: PsAccounts,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PsAccounts },
  template: '<ps-accounts v-bind="$props" />',
});

export const NotConnected:any = Template.bind({});
NotConnected.args = {
  context: Object.assign({}, contextPsAccountsNotConnected),
}

export const Connected:any = Template.bind({});
Connected.args = {
  context: Object.assign({}, contextPsAccountsConnected),
}

export const ConnectedAndValidated:any = Template.bind({});
ConnectedAndValidated.args = {
  context: Object.assign({}, contextPsAccountsConnectedAndValidated),
}
