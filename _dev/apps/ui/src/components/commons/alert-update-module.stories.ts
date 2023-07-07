import cloneDeep from 'lodash.clonedeep';
import {rest} from 'msw';
import {initialStateApp} from '@/../.storybook/mock/state-app';
import AlertUpdateModuleVue from './alert-update-module.vue';

export default {
  title: 'Basic Components/Alerts/Module upgrade',
  component: AlertUpdateModuleVue,
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {AlertUpdateModuleVue},
  template: `
    <AlertUpdateModuleVue
      v-bind="$props"
    />`,
  beforeCreate(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
  },
});

export const UpdateOfMarketingWithGoogle: any = Template.bind({});
UpdateOfMarketingWithGoogle.args = {
  moduleName: 'psxmarketingwithgoogle',
  neededVersion: '9.9.9',
};
UpdateOfMarketingWithGoogle.parameters = {
  msw: {
    handlers: [
      rest.post('/', (req, res, ctx) => {
        const payload = req.body.action;

        if (payload === 'getModuleStatus') {
          return res(
            ctx.json({
              version: '1.40.0',
              upgradeLink:
                'https://some.website/module/manage/action/upgrade/psxmarketingwithgoogle',
              hooks: {
                displayBackOfficeHeader: true,
                displayHeader: true,
                displayOrderConfirmation: true,
                displayTop: true,
                actionCartUpdateQuantityBefore: true,
              },
            }),
          );
        }
        return null;
      }),
    ],
  },
};

export const UpdateOfCloudSync: any = Template.bind({});
UpdateOfCloudSync.args = {
  moduleName: 'ps_eventbus',
  neededVersion: '9.9.9',
};
UpdateOfCloudSync.parameters = {
  msw: {
    handlers: [
      rest.post('/', (req, res, ctx) => {
        const payload = req.body.action;

        if (payload === 'getModuleStatus') {
          return res(
            ctx.json({
              version: '2.0.2',
              upgradeLink:
                'https://shop7.webmodule.prestashop.net/pokedoge/ps-admin/index.php/module/manage/action/upgrade/ps_eventbus?_token=aKja3ISxjsqhTKAGVlFU0vzBfuq78xbtTLXvwdeF99c',
              hooks: {
                displayBackOfficeHeader: false,
                displayHeader: false,
                displayOrderConfirmation: false,
                displayTop: false,
                actionCartUpdateQuantityBefore: false,
              },
            }),
          );
        }
        return null;
      }),
    ],
  },
};
