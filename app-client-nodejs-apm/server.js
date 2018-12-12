'use strict'

var apm = require('elastic-apm-node').start({
  frameworkName: 'express',
  frameworkVersion: 'unknown',
  serviceName: 'aplicacao-25ati-nodejs-v2',
  serverUrl: 'http://apm-server:8200',
  flushInterval: 1,
  maxQueueSize: 1,
  apiRequestTime: "50ms",
  ignoreUrls: ['/healthcheck']
})

var app = require("express")();
var fs = require('fs');
var path = require('path');

//app.use('/ati_arquivos', express.static('arquivos'));
//app.use("/ati_arquivos", express.static(path.resolve(__dirname, 'ati_arquivos')));

app.get("/", function(req, res) {
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

app.get("/healthcheck", function(req, res) {
    res.send("OK: " + path.resolve(__dirname, 'ati_arquivos'));
    app.use("/ati_arquivos", express.static(path.resolve(__dirname, 'ati_arquivos')));
});

app.get("/ati", function(req, res) {
  ati_route()
  fs.readFile('ati.htm', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

function ati_route () {
    var span = apm.startSpan('app.ati', 'custom')
    span.end()
}

app.get("/bar", function(req, res) {
    bar_route()
    res.send("Quando será nosso happy hour? <br><br> Vamos para o bar?");
});

function bar_route () {
    var span = apm.startSpan('app.bar', 'custom')
    extra_route()
    span.end()
}

function extra_route () {
    var span = apm.startSpan('app.extra', 'custom')
    span.end()
}

app.get("/oof", function(req, res, next) {
    next(new Error("oof"));
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

var server = app.listen('3000', '0.0.0.0', function () {
    console.log("Listening on %s...", server.address().port);
});
