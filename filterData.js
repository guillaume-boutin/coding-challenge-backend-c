var express = require('express');
var fs = require('fs');
var jsonfile = require('jsonfile');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

var JSONmatches = require('./data/matches.json');
var filteredMatches = require('./data/filteredMatches.json');

var exceptions = [];
var i = 0;
JSONmatches.forEach( function(line) {

  if (!/\d+\s+\d+\s+\D+\/\D+\s+\d{4}-\d{2}-\d{2}/.test(line) ) {
    exceptions.push(JSONmatches[i]);
  }
  i++;
})

console.log(exceptions);
