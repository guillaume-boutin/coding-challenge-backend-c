var calculateDistance = require('./calculateDistance.js');

module.exports = function(reqQuery, cities) {

  if (reqQuery.hasOwnProperty("q")) {
    var inputStr = reqQuery.q;
    var fullRe = new RegExp('^'+inputStr+'$', "i");
  } else if (reqQuery.hasOwnProperty("begins")) {
    inputStr = '^'+reqQuery.begins;
    fullRe = new RegExp(inputStr+'$', "i");
  } else {
    inputStr = reqQuery.ends+'$';
    fullRe = new RegExp('^'+inputStr, "i");
  }

  var re = new RegExp(inputStr, "i");

  var results = [];

  cities.forEach( function(city) {

    var passed = false;

    if (re.test(city.name)) {
      city.name_match = city.name;
      passed = true;
    }
    else {

      var partialMatches = [];
      for (i=0; i<city.alt_name.length; i++) {
        var an = city.alt_name[i];
        if (fullRe.test(an)) {
          var fullMatch = true;
          city["name"] = an;
          passed = true;
          break;
        }
        else if (re.test(an)) {
          partialMatches.push(an);
        }
      }

      if (!fullMatch && partialMatches.length > 0) {
        var matchLengths = partialMatches.map( function(match) {
          return match.length;
        });
        var minLength = Math.min.apply(Math, matchLengths);
        city["name"] = partialMatches[matchLengths.indexOf(minLength)];
        passed = true;
      }
    }

    var filterDistance = false;

    if (reqQuery.hasOwnProperty("longitude")) {

      var distance = calculateDistance(Number(reqQuery.longitude), Number(reqQuery.latitude), Number(city["long"]), Number(city["lat"]));
      city["distance"] = distance;

      if (reqQuery.hasOwnProperty("farther")) {
        var filterDistance = true;
        if (reqQuery.hasOwnProperty("closer")) {
          var distanceCondition = distance >= reqQuery.farther && distance <= reqQuery.closer;
        } else {
          var distanceCondition = distance >= reqQuery.farther;
        }
      }
      else if (reqQuery.hasOwnProperty("closer")) {
        var filterDistance = true;
        var distanceCondition = distance <= reqQuery.closer
      } else {
        filterDistance = false;
      }

    }

    if (passed && filterDistance && distanceCondition) {
      results.push(city);
    }
    else if (passed && !filterDistance) {
      results.push(city);
    }

  });

  return results;

}
