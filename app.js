var http = require('http');
var port = process.env.PORT || 2345;

var express = require('express');
var app = express();

var search = require('./functions/search.js');

app.set('port', port);

app.get('/suggestions', function(req, res) {

  var passed = false;
  var message = "";

  var queries = [];
  var distances = [];
  var sortings = [];
  var coordinates = [];
  var unknowns = [];

  for (key in req.query) {
    if (key === "q" || key === "begins" || key === "ends") {
      queries.push(req.query.key);
    }
    else if (key === "farther" || key === "closer") {
      distances.push(req.query.key);
    }
    else if (key === "distance" || key === "score") {
      sortings.push(req.query.key);
    }
    else if (key === "latitude" || key === "longitude") {
      coordinates.push(req.query.key);
    }
    else {
      unknowns.push(req.query.key);
    }
  }

  if (queries.length === 0) {
    message = "You must enter either q, begins or end as a name query.";
  }
  else if (queries.length > 1) {
    message = "You can only have one query for name."
  }
  else if (distances.length > 0) {
    if (distances.length > 1) {
      message = "Query cannot have closer and farther at the same time. Pick only one of them.";
    }
    else if (isNaN(req.query[distances[0]])) {
      message = "closer or farther parameter must be a number";
    }
    else {
      passed = true;
    }
  }

  else if (sortings.length > 0) {
    if (sortings.length > 1) {
      message = "Cannot sort both distance and score at the same time.";
    }
    else if (req.query[sortings[0]] !== "asc" && req.query[sortings[0]] !== "desc") {
      message = "distance or score can only have values asc or desc.";
    }
    else {
      passed = true;
    }
  }

  else if (coordinates.length > 0) {
    if ( coordinates.length !== 2) {
      message = "Both latitude and longitude are requires, or none of them."
    }
    else if (Number(req.query.latitude) > 90 || Number(req.query.latitude) < -90 || isNaN(req.query.latitude)) {
      message = "Latitude must be a number in between -90 and 90 inclusively";
    }
    else if (Number(req.query.longitude) > 180 || Number(req.query.longitude) < -180 || isNaN(req.query.longitude)) {
      message = "Longitude must be a number in between -180 and 180 inclusively";
    }
    else {
      passed = true;
    }
  }

  else {
    passed = true;
  }

  console.log(passed);

  if (!passed) {
    res.status(400).send("ERROR 400: "+message);
  }
  else {

    var results = search( req.query );

    if (results.length === 0) {
      res.status(404).json({"suggestions": []});
    }
    else {
      res.status(200).json({"suggestions": results});
    }

  }
  res.end();

})

var server = http.createServer(app);

server.listen(port, '127.0.0.1');

module.exports = server;

// module.exports = http.createServer(function (req, res) {
//   res.writeHead(404, {'Content-Type': 'text/plain'});
//
//   if (req.url.indexOf('/suggestions') === 0) {
//     res.end(JSON.stringify({
//       suggestions: []
//     }));
//   } else {
//     res.end();
//   }
// }).listen(port, '127.0.0.1');

console.log('Server running at http://127.0.0.1:%d/suggestions', port);
