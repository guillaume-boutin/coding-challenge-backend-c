var http = require('http');
var port = process.env.PORT || 2345;

var express = require('express');
var app = express();

var search = require('./functions/search.js');

app.set('port', port);

app.get('/hello', function (req, res) {
  res.send('Hello World!');
});

app.get('/suggestions', function(req, res) {

  console.log(search(req.query));

  res.json({"suggestions": search( req.query )});

  res.end();

})

var server = http.createServer(app);

server.listen(port);

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
