var shoe = require('shoe'),
    moment = require('moment'),
    through = require('through');

var username = prompt('username');
var messageInput = document.getElementById('message-input');
var result = document.getElementById('list');

var stream = shoe('/chat');
stream.on('data', function(json) {
    var msg = JSON.parse(json);
    var line = document.createElement('div');

    var date = line.appendChild(document.createElement('span'));
    date.className = 'date';
    date.innerHTML = moment(msg.date).format('h:mm:ssa');

    var user = line.appendChild(document.createElement('span'));
    user.className = 'username ' + ((msg.username == username) ? 'me' : '');
    user.innerHTML = msg.username;

    var txt = line.appendChild(document.createElement('span'));
    txt.innerText = msg.message;
    result.appendChild(line);
    line.scrollIntoView();
});

document.getElementById('message-form').onsubmit = function() {
    stream.write(JSON.stringify({
        message: messageInput.value,
        date: +new Date(),
        username: username
    }));
    messageInput.value = '';
    return false;
};
