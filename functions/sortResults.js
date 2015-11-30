module.exports = function(results, reqQuery) {

  if (reqQuery.hasOwnProperty("sortdistance")) {
    var param = "distance";
  }
  else {
    param = "score"
  }
  if (reqQuery[param] === "asc") {
    var order = "asc";
  }
  else {
    order = "desc";
  }

  var sortedResults = [ results[0] ];

  if (order === "asc") {

    for (i=1; i<results.length; i++) {

      for (j=0; j<sortedResults.length; j++) {
        if (Number(results[i][param]) <= Number(sortedResults[j][param])) {
          sortedResults.splice(j, 0, results[i]);
          break;
        }
        else if (j === sortedResults.length-1) {
          sortedResults.push(results[i]);
          break;
        }
      }
    }
  }

  if (order === "desc") {

    for (i=1; i<results.length; i++) {

      for (j=0; j<sortedResults.length; j++) {
        if (Number(results[i][param]) >= Number(sortedResults[j][param])) {
          sortedResults.splice(j, 0, results[i]);
          break;
        }
        else if (j === sortedResults.length-1) {
          sortedResults.push(results[i]);
          break;
        }
      }
    }

  }

  return sortedResults

}
