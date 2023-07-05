export const dateGenerator = (offset: number): string => {
  const formatDate = (date: Date): string => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
  }
  const date = new Date();
  return formatDate(new Date(date.setDate(date.getDate() - offset)));
}

export const dateTokenGenerator = (offset: number): string => {
  const date = new Date()
  return new Date(date.setDate(date.getDate() - offset)).toISOString();
}
