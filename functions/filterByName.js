module.exports = function(inputStr, cities) {

  var re = new RegExp(inputStr, "i");
  var fullRe = new RegExp('^'+inputStr+'$', "i");

  var results = [];

  cities.forEach( function(city) {
    if (re.test(city.name)) {
      results.push(city);
    }
    else {

      var partialMatches = [];
      for (i=0; i<city.alt_name.length; i++) {
        var an = city.alt_name[i];
        if (fullRe.test(an)) {
          var fullMatch = true;
          city.name = an;
          results.push(city);
          break;
        }
        else if (re.test(an)) {
          partialMatches.push(an);
        }
      }

      if (!fullMatch && partialMatches.length > 0) {
        city.name = partialMatches[0];
        results.push(city);
      }
    }

  });

  return results;

}
