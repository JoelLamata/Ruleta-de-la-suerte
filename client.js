var socket = io();

var roomElement = document.getElementById('room number');
var usernameElement = document.getElementById('username');

var loginMain = document.getElementById('login');
var roomMain = document.getElementById('room main');

var User = {
    id: "",
    username: "",
    room: ""
}

function join() {
    if (roomElement.value != '' && usernameElement.value != '') {
        socket.emit('join', roomElement.value, usernameElement.value);
        roomElement.value = '';
        usernameElement.value = '';
    }
    else {
        if (roomElement.value == '') roomElement.style.border = '4px solid red';
        else roomElement.style.border = '4px solid white';
        if (usernameElement.value == '') usernameElement.style.border = '4px solid red';
        else usernameElement.style.border = '4px solid white';
    }
}


function createRoom() {
    if (usernameElement.value != '') {
        socket.emit('create', usernameElement.value);
        usernameElement.value = '';
    }
    else {
        usernameElement.style.border = '4px solid red';
        roomElement.style.border = '4px solid white';
    }
}

socket.on('start', function (data) {
    var d = JSON.parse(data);
    if (User.id == "") {
        console.log(d);
        User.id = d.id;
        User.room = d.room;
    }
})

socket.on('chat message', function (msg) {
    console.log(msg);
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('join', function (id, room, username, users) {
    var users_str = JSON.parse(users);
    if (id == User.id) {
        console.log("Joining room: ", room);
        User.room = room;
        User.username = username;
        console.log(users_str);
        loginMain.style.display = 'none';
        roomMain.style.display = '';
        getUsernames(users_str);
    }
});

socket.on('create', function (id, room, username) {
    if (id == User.id) {
        console.log("Joining room: ", room);
        User.room = room;
        User.username = username;
    }
});

function getUsernames(users) {
    // var item = document.createElement('h1');
    // item.className = "box";
    // item.textContent = User.username;
    // roomMain.appendChild(item);
    for (i = 0; i < users.length; i++) {
        var item = document.createElement('h1');
        item.className = "box";
        item.textContent = users[i].username;
        roomMain.appendChild(item);
    }
}