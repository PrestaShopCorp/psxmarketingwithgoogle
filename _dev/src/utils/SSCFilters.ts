export type CampaignFilter = {
    name?: string;
    id?: string;
    checked?: boolean;
    indeterminate?: boolean;
    children?: CampaignFilter[];
  };
export type FiltersChosen = {
    dimension?: string;
    values: Array<string| undefined>;
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
          // TODO : replace when api is implemented on POST
          // final[index].dimension = child.name;
          final[index].dimension = 'category';
          final[index].values.push(child2.id);
        });
        returnChildrenIds(child);
      }
    });
  } else {
    final.push({
      // dimension: source.name,
      dimension: 'category',
      values: [source.id],
    });
  }
  return final;
}

export function checkAndUpdateDimensionStatus(source: CampaignFilter) {
  const checkedChildren = source.children?.filter((element) => {
    if (element.children) {
      checkAndUpdateDimensionStatus(element);
    }
    return element.checked;
  });
  const indeterminedOrCheckedChildren = source.children?.filter(
    (element) => element.checked || element.indeterminate);

  if (checkedChildren && indeterminedOrCheckedChildren) {
    source.checked = checkedChildren.length === source.children?.length;
    source.indeterminate = !source.checked && !!indeterminedOrCheckedChildren.length;
  }
  return source;
}

export function deepCheckDimension(source: CampaignFilter, checkboxClicked) {
  source.checked = checkboxClicked;
  if (source.children) {
    source.children.forEach((child) => {
      deepCheckDimension(child, checkboxClicked);
    });
  }
  return source;
}

export function getFiltersbyIds(productFilters: Array<FiltersChosen>,
  availableFilters:CampaignFilter):CampaignFilter {
  if (availableFilters.children) {
    availableFilters.children.forEach((availableFilter) => {
      const productFilter = productFilters
        .find((pro) => pro.dimension === availableFilter.name);
      if (availableFilter.children) {
        availableFilter.children.map((child) => {
          if (child.id && productFilter?.values.includes(child.id)) {
            child.checked = true;
          }
          return child;
        });
      }
      checkAndUpdateDimensionStatus(availableFilters);
    });
  }

  return availableFilters;
}
