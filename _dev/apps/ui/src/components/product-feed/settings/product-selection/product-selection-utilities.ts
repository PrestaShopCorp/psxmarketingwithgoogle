export const newFilter = () => ({
  id: crypto.randomUUID(),
});

export const localStorageProductFilter = 'productFeed-productFilter';
export const localStorageProductFilterSync = 'productFeed-productFilterSync';

export default {newFilter, localStorageProductFilter, localStorageProductFilterSync};
