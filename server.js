//Database
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = require("./sensitiveinfo").uri;

const client = new MongoClient(uri);
const database = client.db('users');
const usersDB = database.collection('users');

var User = {
  id: "",
  username: "",
  room: ""
}

async function findUser(id) {
  try {
    const query = { id: id };
    //console.log(query);
    const result = await usersDB.countDocuments(query) > 0;
    //console.log(result);
    return result;
  }
  catch (e) { }
}
async function addUser() {
  try {
    for (i = 0; i < i + 1; i++) {
      var res = await findUser(i);
      if (res == false) {
        User.id = i;
        break;
      }
    }
    console.log("New user:", User);
    usersDB.updateOne(User, { $setOnInsert: User }, { upsert: true });
  }
  catch (e) { }
}
async function deleteUser(id) {
  try {
    const query = { id: id };
    const result = await usersDB.deleteOne(query);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
  }
  catch (e) { }
}

function createUser() {
  User.room = 1;
  addUser(User);
  //console.log("User id:", User.id);
  var user_str = JSON.stringify(User);
  io.emit('start', user_str);
}

async function changeRoom(id, room) {
  room = Number(room);
  User.room = room;
  try {
    const query = { id: id };
    //console.log(query);
    const result = await usersDB.updateOne(query, { $set: User });
    //console.log(result);
  }
  catch (e) { }
}

function getUsersFromRoom(room) {
  try {
    //const query = { room: Number(room) };
    //console.log(query);  
    const result = usersDB.find();
    //console.log(result);
    while (result.hasNext()) {
      console.log("holi");
      System.out.println(result.next());
    }
  }
  catch (e) { }
}

//Server
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var path = require('path');

app.set('views', path.join(__dirname, '/'));
// remove dir name to server anyfile
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  createUser();
  socket.join(1);

  socket.on('disconnect', () => {
    console.log('user:', User.id, ' disconnected');
    deleteUser(User.id);
  });

  socket.on('join', (room, username) => {
    console.log(`User: ${User.id}, with username: ${username}, joining room: ${room}`);
    User.username = username;
    socket.leave(User.room);
    changeRoom(User.id, room);
    socket.join(room);
    getUsersFromRoom(room);
    io.emit('join', User.id, room, username);
  });

  socket.on('chat message', (user, msg) => {
    console.log(user, msg);
    var user_str = JSON.parse(user);
    io.to(user_str.room).emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
