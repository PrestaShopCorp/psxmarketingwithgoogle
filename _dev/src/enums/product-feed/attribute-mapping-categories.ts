enum Categories {
  APPAREL_AND_ACCESSORIES = 'apparelAndAccessories',
  ELECTRONICS = 'electronics',
  VARIANT_SETS = 'variantSets',
  COMMONS = 'commons',
  NONE = 'none',
}

export type SelectedProductCategories = [Categories.NONE]|Exclude<Categories, Categories.NONE>[];

export default Categories;
