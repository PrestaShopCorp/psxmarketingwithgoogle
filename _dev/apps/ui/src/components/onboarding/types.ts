import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';

export interface StepLink {
  name: string;
  step: number;
  params: ProductFeedSettingsPages;
}
