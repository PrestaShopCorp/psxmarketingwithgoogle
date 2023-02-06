import {AttributesInfos} from '../store/modules/product-feed/state';

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
  description?: MappedAttribute[];
  gtin?: MappedAttribute[];
  mpn?: MappedAttribute[];
  brand?: MappedAttribute[];
  ageGroup?: MappedAttribute[];
  color?: MappedAttribute[];
  gender?: MappedAttribute[];
  size?: MappedAttribute[];
  maxEnergyEfficiencyClass?: MappedAttribute[];
  minEnergyEfficiencyClass?: MappedAttribute[];
  energyEfficiencyClass?: MappedAttribute[];
  material?: MappedAttribute[];
  pattern?: MappedAttribute[];
}

export type MappedAttribute = {
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
        acc[cur.name] = cur.mapped.map((attr) => makeMappingBackwardCompatible(attr));
      } else {
        acc[cur.name] = cur.recommended.map((attr) => makeMappingBackwardCompatible(attr));
      }
      return acc;
    }, {});
}

export const mergeAttributeMappings = (
  source: AttributeToMap[],
  anotherSource: AttributeToMap[]|null,
): AttributeToMap[] => source.map((attributeCategory) => {
  const attributeCategoryInAnotherSource = anotherSource?.find(
    (acInAnotherSource) => attributeCategory.category === acInAnotherSource.category,
  );

  if (!attributeCategoryInAnotherSource) {
    return attributeCategory;
  }
  attributeCategory.fields.map((attribute) => {
    attribute.mapped = attributeCategoryInAnotherSource.fields.find(
      (aias) => attribute.label === aias.label,
    )?.mapped || attribute.mapped;
    return attribute;
  });
  return attributeCategory;
});

const fixUnusedAttributeNames = (source: string) => {
  if (source === 'ean13') {
    return 'ean';
  }
  if (source === 'shortDescription') {
    return 'description_short';
  }
  return source;
};

function makeMappingBackwardCompatible(
  attr: RecommendedFieldType,
): MappedAttribute {
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
}

export function parseApiResponse(
  attributes: AttributeToMap[],
  attributesFromShop: AttributesInfos[],
  mappingFromApi: AttributeResponseFromAPI,
): AttributeToMap[] {
  const attributeToMap = attributes.flatMap((attr) => attr.fields);

  attributeToMap.forEach((attribute) => {
    if (!attribute.mapped) {
      attribute.mapped = [];
    }
    attributesFromShop
      .filter((a) => oneInOne(mappingFromApi[attribute.name]?.map(
        (e) => fixUnusedAttributeNames(e.id)) || [], a.name),
      ).forEach((e) => {
        if (!deepEqual(attribute.mapped, e)) {
          // eslint-disable-next-line no-unused-expressions
          attribute?.mapped?.push(e);
        }
      });
  });

  return attributes;
}

export function filterMapping(mapping: AttributeResponseFromAPI): AttributeResponseFromAPI {
  const result = {};

  Object.keys(mapping).forEach((key) => {
    result[key] = mapping[key].filter((attr) => attr.id || attr.ids);
  });

  return result;
}

export function oneInOne(a: string[], b: string[]): boolean {
  return a.some((item) => b.includes(item));
}

export function deepEqual(x, y) : boolean {
  return x.some((item) => arrayEquals(item.name, y.name));
}

export function arrayEquals(a: string[], b: string[]): boolean {
  return Array.isArray(a)
    && Array.isArray(b)
    && a.length === b.length
    && a.every((val, index) => val === b[index]);
}
