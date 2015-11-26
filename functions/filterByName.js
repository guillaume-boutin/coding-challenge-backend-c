module.exports = function(inputStr, cities) {

  var re = new RegExp(inputStr, "i");

  return results = cities.filter( function(city) {
    return re.test(city.name);
  });

}
