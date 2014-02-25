#!/usr/bin/env node

var express = require('express'),
    app = express(),
    server = require('http').createServer(app).listen(3000),
    shoe = require('shoe'),
    fifo = require('stream-fifo'),
    through = require('through'),
    browserify = require('browserify-middleware');

app.use('/js', browserify('./js'));
app.use(express.static(__dirname + '/public'));

var q = fifo(50);
var combine = through(function write(data) {
    this.queue(data);
});

var sock = shoe(function(stream) {
    q.stack().pipe(stream, { end: false });
    stream
        .pipe(combine, { end: false })
        .pipe(stream, { end: false })
        .pipe(q);
});

sock.install(server, '/chat');
