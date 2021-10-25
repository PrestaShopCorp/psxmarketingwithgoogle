export type CampaignFilter = {
    name?: string;
    id?: string;
    checked?: boolean;
    indeterminate?: boolean;
    children?: CampaignFilter[];
  };
export type FiltersChosen = {
    dimension?: string;
    values: Array<number>;
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

export function returnChildrenIds(source: CampaignFilter): Array<FiltersChosen> {
  const final : FiltersChosen[] = [];

  if (source.children) {
    source.children.forEach((child, index) => {
      final.push({
        dimension: '',
        values: [],
      });
      if (child.children) {
        child.children.forEach((child2) => {
          // final[index].dimension = child.name;
          final[index].dimension = 'category';
          final[index].values.push(Number(child2.id));
        });
        returnChildrenIds(child);
      }
    });
  } else {
    final.push({
      // dimension: source.name,
      dimension: 'category',
      values: [Number(source.id)],
    });
  }
  return final;
}

export function checkForIndeterminate(source: CampaignFilter) {
  const isIndeterminate = source.children?.map((element) => {
    if (element.children) {
      return checkForIndeterminate(element);
    }
    return element.checked;
  });
  if (isIndeterminate && isIndeterminate.includes(true) && isIndeterminate.includes(false)) {
    source.indeterminate = true;
  } else {
    source.indeterminate = false;
  }
  return source;
}
