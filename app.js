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

  Object.keys(req.query).forEach( function(key) {

    if (key === "q" || key === "begins" || key === "ends") {
      queries.push(req.query[key]);
    }
    else if (key === "farther" || key === "closer") {
      distances.push(req.query[key]);
    }
    else if (key === "sortdistance" || key === "sortscore") {
      sortings.push(req.query[key]);
    }
    else if (key === "latitude" || key === "longitude") {
      coordinates.push(req.query[key]);
    }
    else {
      unknowns.push(req.query[key]);
    }
  });

  if (queries.length === 0) {
    message = "You must enter either q, begins or end as a name match query.";
  }
  if (queries.length > 1) {
    message = "You can only have one query for name match.";
  }
  if (queries[0].length < 3) {
    message = "Name match query must be at least 3 characters long";
  }

  if (coordinates.length > 0) {
    if ( coordinates.length !== 2) {
      message = "Both latitude and longitude are requires, or none of them."
    }
    else if (Number(req.query.latitude) > 90 || Number(req.query.latitude) < -90 || isNaN(req.query.latitude)) {
      message = "Latitude must be a number in between -90 and 90 inclusively";
    }
    else if (Number(req.query.longitude) > 180 || Number(req.query.longitude) < -180 || isNaN(req.query.longitude)) {
      message = "Longitude must be a number in between -180 and 180 inclusively";
    }
  }

  if (distances.length > 0) {
    if (coordinates.length === 0) {
      message = "You cannot specify a distance without specifiying longitude and latitude coordinates."
    }
    else if (isNaN(distances[0])) {
      message = "closer and farther parameter must be a number";
    }
    else if (distances[0] > 20050 || distances[1] > 20050) {
      message = "Distance query is greater than Earth's half circumference."
    }
  }

  if (sortings.length > 0) {
    if (sortings.length > 1) {
      message = "Cannot sort both distance and score at the same time.";
    }
    else if (req.query.hasOwnProperty("sortdistance") && coordinates.length === 0) {
      message = "Cannot sort distance without having longitude and latitudes coordinates";
    }
    else if (sortings[0] !== "asc" && sortings[0] !== "desc") {
      message = "sortdistance or sortscore can only have values asc or desc.";
    }
  }



  if (message.length > 0) {
    passed = false;
  }
  else {
    passed = true;
  }

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

server.listen(port, function() {
  console.log('Server running at http://127.0.0.1:%d/suggestions', port);
});

module.exports = server;
