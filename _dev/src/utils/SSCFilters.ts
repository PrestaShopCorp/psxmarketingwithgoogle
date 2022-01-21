import {DimensionChosen} from '@/store/modules/smart-shopping-campaigns/state';

export function addPropertiesToDimension(dimension: DimensionChosen[]) :DimensionChosen[] {
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

export function filterUncheckedSegments(source: DimensionChosen) {
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

export function returnChildrenIds(source: DimensionChosen) {
  let values : string[] = [];
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

export function checkAndUpdateDimensionStatus(source: DimensionChosen) {
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

export function deepCheckDimension(source: DimensionChosen, checkboxClicked) {
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

export function returnCountProducts(source : DimensionChosen): number {
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
  return total + Number(source.numberOfProductsAssociated);
}
