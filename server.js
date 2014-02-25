var express = require('express'),
    app = express(),
    server = require('http').createServer(app).listen(3000),
    shoe = require('shoe'),
    through = require('through'),
    browserify = require('browserify-middleware');

app.use('/js', browserify('./js'));
app.use(express.static(__dirname + '/public'));

var combine = through(function write(data) {
    this.queue(data);
});

var sock = shoe(function(stream) {
    stream.pipe(combine).pipe(stream);
});

sock.install(server, '/chat');
