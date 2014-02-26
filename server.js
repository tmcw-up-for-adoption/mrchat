#!/usr/bin/env node

var server = require('http').createServer(app).listen(3000),
    shoe = require('shoe'),
    fifo = require('stream-fifo'),
    brfs = require('brfs'),
    concat = require('concat-stream'),
    Stream = require('stream'),
    through = require('through'),
    moment = require('moment'),
    browserify = require('browserify');

var q = fifo(50),
    combine = new Stream.PassThrough();

var sock = shoe(function(stream) {
    q.stack().pipe(stream, { end: false });
    stream
        .pipe(combine, { end: false })
        .pipe(stream, { end: false })
        .pipe(q);

    stream.pipe(through(function(json) {
            var data = JSON.parse(json);
            this.queue(moment(data.date).format() + '\t' + data.username + '\t' + data.message + '\n');
        }))
        .pipe(process.stdout);
});

var client = '';

browserify()
    .add('./client.js')
    .transform(brfs)
    .bundle()
    .pipe(concat(function(src) {
        client = '<html><body><script>' + src + '</script>';
    }));

function app(req, res) {
    res.end(client);
}

sock.install(server, '/chat');
