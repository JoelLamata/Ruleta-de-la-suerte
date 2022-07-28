var socket = io();

var roomElement = document.getElementById('room');
var usernameElement = document.getElementById('username');

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

var User = {
    id: "",
    username: "",
    room : ""
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    var user_str = JSON.stringify(User);
    socket.emit('chat message', user_str, input.value);
    input.value = '';
  }
});

function join() {
    socket.emit('join', roomElement.value, usernameElement.value);
    roomElement.value = '';
    usernameElement.value = '';
}

socket.on('start', function (data) {
    var d = JSON.parse(data);
    if(User.id == ""){
        console.log(d);
        User.id = d.id;
        User.room = d.room;
    }
    const result = usersDB.find();
    //console.log(result);
    while (result.hasNext()) {
      console.log("holi");
      System.out.println(result.next());
    }
})

socket.on('chat message', function (msg) {
    console.log(msg);
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('join', function (id, room, username) {
    if(id == User.id){
        console.log("Joining room: ", room);
        User.room = room;
        User.username = username;
    }
});