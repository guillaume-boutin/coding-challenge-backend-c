var cities = require('../data/cities_canada-usa.json');
var admin1ToProvince = require('./admin1ToProvince.js');
var filterByName = require('./filterByName.js');
var calculateDistance = require('./calculateDistance.js');
var areaFactor = require('./areaFactor.js');
var nameFactor = require('./nameFactor.js');
var sortResults = require('./sortResults.js');

var R = 6371;

function search(inputStr, lat, lng) {

  citiesFound = filterByName(inputStr, cities);

  var results = [];
  citiesFound.forEach( function(city) {
    var state, country;

    if (city["country"] === "CA") {
      country = "Canada";
      state = admin1ToProvince(city['admin1']);
    } else {
      country = "United-States";
      state = city['admin1'];
    }

    var distance = calculateDistance(lng, lat, Number(city["long"]), Number(city["lat"]));
    var aFactor = areaFactor(distance);
    var nFactor = nameFactor(inputStr, city["name"]);
    var factor = Math.round( aFactor*nFactor*100)/100;

    results.push({
      "name": city["name"]+', '+state+', '+country,
      "latitude": city["lat"],
      "longitude": city["long"],
      "score": factor
    });

  });

  return sortResults(results);

}

console.log(search('London', 43.70011, -79.4163));
