var cities = require('../data/cities_canada-usa.json');
var admin1ToProvince = require('./admin1ToProvince.js');
var filterByNameDistance = require('./filterByNameDistance.js');
var calculateDistance = require('./calculateDistance.js');
var calculateScore = require('./calculateScore.js');
var sortResults = require('./sortResults.js');

var R = 6371;

module.exports = function(reqQuery) {

  if (reqQuery.hasOwnProperty("q")) {
    var inputStr = reqQuery.q;
  } else if (reqQuery.hasOwnProperty("begins")) {
    inputStr = reqQuery.begins;
  } else {
    inputStr = reqQuery.ends;
  }

  if (reqQuery.hasOwnProperty("latitude")) {
    var lat = reqQuery["latitude"];
    var lng = reqQuery["longitude"];
  }

  if (reqQuery.hasOwnProperty("farther")) {
    var farther = reqQuery.farther;
  }
  if (reqQuery.hasOwnProperty("closer")) {
    var farther = reqQuery.closer;
  }

  if (reqQuery.hasOwnProperty("distance")) {
    var sortDistance = reqQuery.distance;
  }
  if (reqQuery.hasOwnProperty("score")) {
    var sortScore = reqQuery.score;
  }

  citiesFound = filterByNameDistance(reqQuery, cities);

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

    var score = calculateScore(reqQuery, city);

    var resultToPush = {
      "name": city["name"]+', '+state+', '+country,
      "latitude": city["lat"],
      "longitude": city["long"],
      "score": score
    }

    if (city.hasOwnProperty("distance")) {
      resultToPush["distance"] = Math.round(city["distance"]);
    }

    results.push(resultToPush);

  });

  if (results.length === 0) {
    return [];
  }
  else {
    return sortResults(results, reqQuery);
  }
  
}
