var cities = require('../data/cities_canada-usa.json');

function checkUsStates() {

  var checkedCities = cities.filter( function(city) {
    return (city["country"] === "CA" && /\d+/.test(city["admin1"]))
  });

  return checkedCities.length;

}

console.log(checkUsStates());
