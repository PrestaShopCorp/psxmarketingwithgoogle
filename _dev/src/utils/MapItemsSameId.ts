import {ProductInfos} from '@/store/modules/product-feed/state';

export function mapItemsSameId(items : Array<ProductInfos>) {
  const final = items.reduce((product, data) => {
    if (!product[data.id]) {
      product[data.id] = [];
    }
    product[data.id].push(data);
    return product;
  }, []);

  return final.filter((n) => n);
}
export default {mapItemsSameId};
