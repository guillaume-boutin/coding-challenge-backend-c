var fs = require('fs');
var jsonfile = require('jsonfile');

fs.readFile('./data/cities_canada-usa.tsv', 'utf-8', function(err, data) {
  if (err) throw err;

  var linesArr = [];

  var lines = data.split('\n');
  lines.forEach( function(line) {
    linesArr.push(line.split('\t'));
  });

  headLine = linesArr[0]
  citiesArr = [];

  for (i=1; i<linesArr.length; i++) {
    var lineObj = {};
    for (j=0; j<headLine.length; j++) {
      lineObj[headLine[j]] = linesArr[i][j];
    }
    citiesArr.push(lineObj);
  }

  jsonfile.writeFile('./data/cities_canada-usa.json', citiesArr, function(err) {
    if (err) {
      throw err;
    }
  });

});
