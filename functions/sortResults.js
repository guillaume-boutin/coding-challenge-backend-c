module.exports = function(results, reqQuery) {

  var sortedResults = [ results[0] ];

  for (i=0; i<results.length; i++) {

    for (j=sortedResults.length-1; j>=0; j--) {
      if (Number(results[i]["score"]) >= Number(sortedResults[j]["score"])) {
        sortedResults.splice(j+1, 0, results[i]);
        break;
      }
      else if (j === 0) {
        sortedResults.splice(0, 0, results[i]);
      }

    }

  }

  return sortedResults

}
