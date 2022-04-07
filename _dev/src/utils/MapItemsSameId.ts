import {ProductInfos} from '@/store/modules/product-feed/state'

export function mapItemsSameId(items : Array<ProductInfos>) {
  const final = items.reduce((product, data) => {
    console.log('1', product[data.id]);
    console.log('2',data);
    if (!product[data.id]){
      product[data.id] = [];
    } 
    product[data.id].push(data);
    return product;
  }, []);

  console.log(final)
return final.filter(n => n)


  // const final = items.reduce(
  //   (results, current) => ({
  //     ...results,
  //         id: current.id,
  //         attribute: current.attribute,
  //         name: current.name,
  //         countries: current.statuses?.countries.concat(results[current.id].countries),
  //         // destination: current.statuses?.destination,
  //         // issues : current.issues? current.issues.concat(results[current.id].issues) : [],
  //     }
  //     ),
  //     {}
  //     );
  //     console.log('final', final)
  
    }  
  export default {mapItemsSameId};
  