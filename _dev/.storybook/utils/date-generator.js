exports.dateGenerator = function(offset){
  const formatDate = function(date) {
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
  var date = new Date();
  return formatDate(new Date(date.setDate(date.getDate() - offset)));
}

exports.dateTokenGenerator = function(offset){
  var date = new Date()
  return new Date(date.setDate(date.getDate() - offset)).toISOString();
}
