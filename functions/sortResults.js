module.exports = function(results) {

  var sortedResults = [];
  for (i=0; i<results.length; i++) {

    if (sortedResults.length === 0) {
      sortedResults.push(results[i]);
    }

    for (j=sortedResults.length-1; j>=0; j--) {
      if (Number(results[i]["score"]) < Number(sortedResults[j]["score"])) {
        sortedResults.splice(j+1, 0, results[i]);
        break;
      }

    }

  }

  return sortedResults

}
