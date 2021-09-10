import ProductsPerformanceTable from '../src/components/smart-shopping-campaign/reporting/products-performance/products-performance-table.vue'

export default {
  title: 'Reporting/Products Performance',
  component: ProductsPerformanceTable,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductsPerformanceTable },
  template: `
    <div>
      <ProductsPerformanceTable v-bind="$props"/>
    </div>
  `,
});

export const ProductsPerformance:any = Template.bind({});
ProductsPerformance.args = {
}
