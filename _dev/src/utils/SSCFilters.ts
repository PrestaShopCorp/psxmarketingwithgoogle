export type CampaignFilter = {
    name?: string;
    id?: string;
    checked?: boolean;
    indeterminate?: boolean;
    children?: CampaignFilter[];
  };

export function filterUncheckedSegments(source: CampaignFilter) {
  const filteredChildren = source.children?.map((child) => {
    if (child.children) {
      return filterUncheckedSegments(child);
    }
    return child;
  }).filter((child) => child.checked || child.children?.length);

  if (!filteredChildren?.length && !source.checked) {
    return {};
  }
  return {
    ...source,
    children: filteredChildren,
  };
}

export function returnChildrenIds(source: CampaignFilter): number[] {
  const ids: number[] = [];
  if (source.children) {
    source.children.forEach((child) => {
      ids.push(...returnChildrenIds(child));
    });
  } else {
    ids.push(Number(source.id));
  }
  return ids;
}
