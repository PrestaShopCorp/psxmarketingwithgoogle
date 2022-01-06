export type CampaignFilter = {
    name?: string;
    id?: string;
    checked?: boolean;
    indeterminate?: boolean;
    numberOfProductsAssociated?: number,
    children?: CampaignFilter[];
  };
export type FiltersChosen = {
    dimension?: string;
    values: Array<string| undefined>;
  };

export function addPropertiesToDimension(dimension: CampaignFilter[]) :CampaignFilter[] {
  const finalDimension = dimension.map((oneFilter) => {
    if (oneFilter.children) {
      return {
        name: oneFilter.name,
        id: oneFilter.id,
        checked: false,
        indeterminate: false,
        numberOfProductsAssociated: oneFilter.numberOfProductsAssociated,
        children: addPropertiesToDimension(oneFilter.children),
      };
    }
    return {
      name: oneFilter.name,
      id: oneFilter.id,
      checked: false,
      indeterminate: false,
      numberOfProductsAssociated: oneFilter.numberOfProductsAssociated,
    };
  });
  return finalDimension;
}

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
  //  REWRITE NEEDED and to discuss with backend
  const final : FiltersChosen[] = [];

  if (source.children) {
    source.children.forEach((child, index) => {
      final.push({
        dimension: '',
        values: [],
      });
      if (child.children) {
        child.children.forEach((child2) => {
          final[index].dimension = child.name;
          final[index].values.push(child2.id);
        });
        returnChildrenIds(child);
      }
    });
  } else {
    final.push({
      dimension: source.name,
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
        .find((pro) => pro.dimension?.toUpperCase() === availableFilter.name?.toUpperCase());
      if (availableFilter.children) {
        availableFilter.children.map((child) => {
          if (child.id && productFilter?.values.includes(child.id)) {
            child.checked = true;
          }
          return child;
        });
      }
    });
    checkAndUpdateDimensionStatus(availableFilters);
  }

  return availableFilters;
}

export function getFilters(arg, final) {
  if (arg.children) {
    arg.children.forEach((child) => getFilters(child, final));
  } else if (arg.checked) {
    final.push(arg);
  }
  return final;
}

export function filterByName(dimensionFilters, search, arr) {
  dimensionFilters.filter((f) => {
    if (f.name.toUpperCase().includes(search.toUpperCase())) {
      arr.push(f);
    }
    if (f.children) {
      return filterByName(f.children, search, arr);
    }

    return arr;
  });
  return arr;
}
