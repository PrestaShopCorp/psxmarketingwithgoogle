export const filterUncheckedSegments = (source: any) => {
  if (!source.children) {
    return source;
  }
  const filteredSource = {...source};

  return {
    ...filteredSource,
    children: filteredSource.children
      .map((child) => {
        if (child.children) {
          return filterUncheckedSegments(child);
        }
        return child;
      })
      .filter((child) => child.checked || child.children?.length),
  }
};

