module.exports = function(reqQuery, city) {

  if (reqQuery.hasOwnProperty("longitude")) {
    var R = 6371;
    var distance = city["distance"];
    var canadaArea = 9985000;
    var usaArea = 9857000;
    var totalArea = canadaArea + usaArea;
    var searchArea = 2*Math.PI*Math.pow(R,2)*(1 - Math.cos(distance/R))
    if (reqQuery.hasOwnProperty("farther")) {
      var minDistance = reqQuery["farther"];
      var choppedArea = 2*Math.PI*Math.pow(R,2)*(1 - Math.cos(minDistance/R));
      totalArea -= choppedArea;
      searchArea -= choppedArea;
    }

    var areaFactor = 1 - searchArea / totalArea;
    if (areaFactor < 0) {
      areaFactor = 0;
    }

  }
  else {
    areaFactor = 1;
  }

  if (reqQuery.hasOwnProperty("q")) {
    var inputStr = reqQuery.q;
  } else if (reqQuery.hasOwnProperty("begins")) {
    inputStr = reqQuery.begins;
  } else {
    inputStr = reqQuery.ends;
  }

  nameFactor = inputStr.length / city["name"].length;

  var score = Math.round(nameFactor*areaFactor*100)/100;


  return score;

}
