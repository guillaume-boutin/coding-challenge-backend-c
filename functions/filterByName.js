module.exports = function(inputStr, cities) {

  var re = new RegExp(inputStr, "i");

  var results = [];

  cities.forEach( function(city) {

    if (re.test(city.name)) {
      results.push(city);
    }
    else {
      for (i=0; i<city.alt_name.length; i++) {
        var an = city.alt_name[i];
        if (re.test(an)) {
          city.name = an;
          results.push(city);
          break;
        }
      }
    }

  });

  return results;

}
