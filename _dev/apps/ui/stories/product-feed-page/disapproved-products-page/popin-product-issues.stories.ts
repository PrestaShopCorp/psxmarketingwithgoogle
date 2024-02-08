import { rest } from 'msw';
import PopinProductIssues from '@/components/product-feed-page/disapproved-products-page/popin-product-issues.vue';
import { ProductIdentifier } from '@/components/product-feed-page/disapproved-products-page/types';
import defaultProductIssuesMock from '@/../.storybook/mock/api-routes/product-validations/7961';


export default {
  title: 'Product Feed Page/Disapproved products Page/Popins',
  component: PopinProductIssues,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PopinProductIssues },
  template: `
    <div>
      <PopinProductIssues visible v-bind="$props" />
    </div>
  `,
});

export const ProductIssues:any = Template.bind({});
ProductIssues.args = {
  product: {
    currency: 'GBP',
    idProduct: '1234',
    languageCode: 'fr',
    idAttribute: '0',
  } as ProductIdentifier,
};
ProductIssues.parameters = {
  msw: {
    handlers: [
      rest.get("/product-validations/*", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(defaultProductIssuesMock),
        );
      }),
    ],
  },
};
