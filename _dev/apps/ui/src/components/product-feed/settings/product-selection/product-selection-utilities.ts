import type {Feature, FeatureOption} from '@/components/product-feed/settings/product-selection/type';

export const newFilter = () => ({
  id: crypto.randomUUID(),
});

export const getFeatureByOptions = (
  features: Feature[],
  options: FeatureOption[],
): Feature | undefined => {
  function featureContainValues(feature: Feature, values: FeatureOption[]) {
    return values.some(
      (value: FeatureOption) => feature.values.some(
        (featureValue: FeatureOption) => featureValue.id === value.id,
      ),
    );
  }

  return features.find((feature: Feature) => featureContainValues(feature, options));
};

export default {newFilter, getFeatureByOptions};
