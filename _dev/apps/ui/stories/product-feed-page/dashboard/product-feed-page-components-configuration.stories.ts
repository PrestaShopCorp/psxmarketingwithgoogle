import FeedConfigurationCard from '@/components/product-feed-page/dashboard/feed-configuration/feed-configuration-card.vue';

export default {
  title: 'Product-Feed-Page/Product Feed Page/Components/Feed Configuration',
};

const ProductFeed = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FeedConfigurationCard },
  template: `<FeedConfigurationCard
    ref="FeedConfigurationCard"
    v-bind="$props"
  />`,
});

export const Default:any = ProductFeed.bind({});
Default.args = {
  productFeedConfiguration: {
    lastModificationDate: new Date(2023, 6, 31, 13, 37),
    targetCountries: ['FR', 'UK', 'IT'], 
    languages: ['it', 'fr', 'de'],
  },
  loading: false,
};

export const ComplexConfiguration:any = ProductFeed.bind({});
ComplexConfiguration.args = {
  productFeedConfiguration: {
    lastModificationDate: new Date(2023, 6, 31, 13, 37),
    targetCountries: ['FR', 'UK', 'IT', 'DE', 'NL', 'PT', 'PL'], 
    languages: ['it', 'fr', 'de', 'en', 'nl', 'pt', 'pl'],
  },
  loading: false,
};

export const Loading:any = ProductFeed.bind({});
Loading.args = {
  productFeedConfiguration: null,
  loading: true,
};

export const NoEligibleLanguage: any = ProductFeed.bind({});
NoEligibleLanguage.args = {
  productFeedConfiguration: {
    lastModificationDate: new Date(2023, 6, 31, 13, 37),
    targetCountries: ['FR', 'UK', 'IT'], 
    languages: [],
  },
  loading: false,
};
