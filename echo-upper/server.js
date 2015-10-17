/// <reference path="../typings/node/node.d.ts"/>
var http = require('http');


console.log('Starting server');
var echo = function(req, res) {
    console.log('Handling request', req);
    var body = '';
    req.on('data', function (chunk) {
        body += chunk.toString().toUpperCase();
    });
    req.on('end', function() {
        res.writeHead(200, 'OK', {'Content-type': 'text/plain'});
        res.write(req.method + ' ' + req.url.toUpperCase());
        res.write('\n');
        res.write(body);
        res.write('\n');
        res.end();
        console.log('Successfully handled request');
    });
};

var port = process.env.PORT || 8080;
http.createServer(echo).listen(port);

