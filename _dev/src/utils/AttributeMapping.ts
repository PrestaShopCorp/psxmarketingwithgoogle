export type AttributeToMap = {
  category: string;
  fields: FieldsContent[];
}

export type FieldsContent = {
  label: string;
  name: string;
  tooltip: Boolean;
  recommended: RecommendedFieldType[];
  mapped: RecommendedFieldType[]|null;
  required: Boolean;
}

export type RecommendedFieldType = {
  name: string[]|string;
  type: string;
}

export type AttributeResponseFromAPI = {
  description?: CategoryDetail[];
  gtin?: CategoryDetail[];
  mpn?: CategoryDetail[];
  brand?: CategoryDetail[];
  ageGroup?: CategoryDetail[];
  color?: CategoryDetail[];
  gender?: CategoryDetail[];
  size?: CategoryDetail[];
  maxEnergyEfficiencyClass?: CategoryDetail[];
  minEnergyEfficiencyClass?: CategoryDetail[];
  energyEfficiencyClass?: CategoryDetail[];
  material?: CategoryDetail[];
  pattern?: CategoryDetail[];
}

export type CategoryDetail = {
  id?: string;
  ids?: string[];
  type: string;
}

export function formatMappingToApi(attributes: AttributeToMap[]): AttributeResponseFromAPI {
  return attributes
    .map((attr) => attr.fields)
    .reduce((acc, cur) => acc.concat(cur), [])
    .reduce((acc, cur) => {
      if (cur.mapped !== null) {
        acc[cur.name] = cur.mapped.map((attr) => {
          if (Array.isArray(attr.name)) {
            return {
              ids: attr.name,
              type: attr.type,
            };
          }
          return {
            id: attr.name,
            type: attr.type,
          };
        });
      } else {
        acc[cur.name] = cur.recommended.map((attr) => {
          if (Array.isArray(attr.name)) {
            return {
              ids: attr.name,
              type: attr.type,
            };
          }
          return {
            id: attr.name,
            type: attr.type,
          };
        });
      }
      return acc;
    }, {});
}

export function filterMapping(mapping: AttributeResponseFromAPI): AttributeResponseFromAPI {
  const result = {};

  Object.keys(mapping).forEach((key) => {
    result[key] = mapping[key].filter((attr) => attr.id);
  });

  return result;
}

export function oneInOne(a: string[], b: string[]): boolean {
  return a.some((item) => b.includes(item));
}

export function deepEqual(x, y: any) {
  return x.some((item) => arrayEquals(item.name, y.name));
  // return (x && y && typeof x === 'object' && typeof y === 'object')
  //   ? (Object.keys(x).length === Object.keys(y).length)
  //     && Object.keys(x).reduce(
  //       (isEqual, key) => isEqual && deepEqual(x[key], y[key]), true,
  //     ) : (x === y);
}

export function arrayEquals(a, b) {
  return Array.isArray(a)
    && Array.isArray(b)
    && a.length === b.length
    && a.every((val, index) => val === b[index]);
}
