module.exports = function(results, reqQuery) {

  var sortedResults = [ results[0] ];

  // for (i=1; i<results.length; i++) {
  //
  //   for (j=sortedResults.length-1; j>=0; j--) {
  //     if (Number(results[i]["score"]) >= Number(sortedResults[j]["score"])) {
  //       sortedResults.splice(j+1, 0, results[i]);
  //       break;
  //     }
  //     else if (j === 0) {
  //       sortedResults.splice(0, 0, results[i]);
  //     }
  //
  //   }
  //
  // }

  for (i=1; i<results.length; i++) {

    for (j=0; j<sortedResults.length; j++) {
      if (Number(results[i]["score"]) >= Number(sortedResults[j]["score"])) {
        sortedResults.splice(j, 0, results[i]);
        break;
      }
      else if (j === sortedResults.length-1) {
        sortedResults.push(results[i]);
        break;
      }

    }

  }


  return sortedResults

}
