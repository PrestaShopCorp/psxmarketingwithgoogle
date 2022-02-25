import {Dimension} from '@/store/modules/smart-shopping-campaigns/state';

interface filtersChosenFromAPI {
  dimension: string,
  values: string[],
}
export function addPropertiesToDimension(
  dimension: Dimension[],
): Dimension[] {
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
      numberOfProductsAssociated: oneFilter.numberOfProductsAssociated,
    };
  });

  return finalDimension;
}

export function filterUncheckedSegments(source: Dimension) {
  const filteredChildren = source.children
    ?.map((child) => {
      if (child.children) {
        return filterUncheckedSegments(child);
      }
      return child;
    })
    .filter((child) => child.checked || child.children?.length);

  if (!filteredChildren?.length && !source.checked) {
    return {};
  }
  return {
    ...source,
    children: filteredChildren,
  };
}

export function returnChildrenIds(source: Dimension) {
  let values: string[] = [];

  if (!source.children && source.id) {
    values.push(source.id);
  }
  if (!source.checked && !source.indeterminate) {
    return values;
  }
  if (source.children) {
    source.children.forEach((child) => {
      values = values.concat(returnChildrenIds(child));
    });
  }
  return values;
}

export function checkAndUpdateDimensionStatus(source: Dimension) {
  const checkedChildren = source.children?.filter((element) => {
    if (element.children) {
      checkAndUpdateDimensionStatus(element);
    }
    return element.checked;
  });
  const indeterminedOrCheckedChildren = source.children?.filter(
    (element) => element.checked || element.indeterminate,
  );

  if (checkedChildren && indeterminedOrCheckedChildren) {
    source.checked = checkedChildren.length === source.children?.length;
    source.indeterminate = !source.checked && !!indeterminedOrCheckedChildren.length;
  }
  return source;
}

export function deepCheckDimension(source: Dimension, checkboxClicked) {
  source.checked = checkboxClicked;
  if (source.children) {
    source.children.forEach((child) => {
      deepCheckDimension(child, checkboxClicked);
    });
  }
  return source;
}

export function getFilters(arg, final) {
  if (arg.children) {
    arg.children.forEach((child) => getFilters(child, final));
  } else if (arg.checked) {
    final.push(arg);
  }
  return final;
}

export function returnCountProducts(source: Dimension): number {
  let total = 0;

  if (!source.checked && !source.indeterminate) {
    return total;
  }
  if (source.children) {
    source.children.forEach((child) => {
      total += returnCountProducts(child);
    });
    return total;
  }
  if (source.numberOfProductsAssociated !== undefined) {
    return total + Number(source.numberOfProductsAssociated);
  }
  return total;
}

export function findAndCheckFilter(
  dimension: Dimension,
  filtersList: (string)[],
) {
  if (dimension.children) {
    dimension.children.forEach((fil) => {
      if (fil.children) {
        return findAndCheckFilter(fil, filtersList);
      }
      filtersList.forEach((valueId) => {
        if (fil.id === valueId) {
          fil.checked = true;
        }
      });
      checkAndUpdateDimensionStatus(fil);
      return dimension;
    });
  }
  checkAndUpdateDimensionStatus(dimension);
  return dimension;
}

// TODO : improve for multiple selected dimensions
export function retrieveProductNumberFromFiltersIds(
  productFilters: filtersChosenFromAPI[], dimensions: Dimension[],
) {
  if (!productFilters.length) {
    return 0;
  }
  const dimensionChosen = dimensions.find((dim) => dim.name === productFilters[0].dimension);

  if (!dimensionChosen) {
    return 0;
  }
  return returnCountProducts(findAndCheckFilter(dimensionChosen, productFilters[0].values));
}
