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
  name: string;
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
  id: string;
  type: string;
}

export function formatMappingToApi(attributes: AttributeToMap[]): AttributeResponseFromAPI {
  return attributes
    .map((attr) => attr.fields)
    .reduce((acc, cur) => acc.concat(cur), [])
    .reduce((acc, cur) => {
      if (cur.mapped !== null) {
        acc[cur.name] = cur.mapped.map((attr) => ({
          id: attr.name,
          type: attr.type,
        }));
      } else {
        acc[cur.name] = cur.recommended.map((attr) => ({
          id: attr.name,
          type: attr.type,
        }));
      }
      return acc;
    }, {});
}
