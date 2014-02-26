var shoe = require('shoe'),
    insertCss = require('insert-css'),
    fs = require('fs'),
    marked = require('marked'),
    moment = require('moment');

var css = fs.readFileSync(__dirname + '/style.css', 'utf8');
insertCss(css);

var username = prompt('username');
var result = document.body.appendChild(document.createElement('div'));
result.id = 'list';

var messageForm = document.body.appendChild(document.createElement('form'));
var messageInput = messageForm.appendChild(document.createElement('input'));
messageInput.id = 'message-input';

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
    txt.innerHTML = marked(msg.message).replace(/<\/?p>/g, '');
    result.appendChild(line);
    line.scrollIntoView();
});

function notify() {
    // 0 is PERMISSION_ALLOWED
    var notification = window.webkitNotifications.createNotification(
        'http://i.stack.imgur.com/dmHl0.png',
        'Chrome notification!',
        'Here is the notification text'
    );
    notification.onclick = function () {
        notification.close();
    }
    notification.show();
}

if (window.webkitNotifications.checkPermission() !== 0) {
    var permissionButton = document.body.appendChild(document.createElement('button'));
    permissionButton.innerHTML = 'get notifications';
    permissionButton.id = 'permission-button';
    permissionButton.onclick = function() {
        window.webkitNotifications.requestPermission();
        permissionButton.parentNode.removeChild(permissionButton);
    };
}

messageForm.onsubmit = function() {
    stream.write(JSON.stringify({
        message: messageInput.value,
        date: +new Date(),
        username: username
    }));
    messageInput.value = '';
    return false;
};
