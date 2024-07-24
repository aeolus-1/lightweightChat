const fetch = require("cross-fetch");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { createHash } = require("crypto");
const list = require("./word_blacklist");
var fs = require('fs');

/////////

const auth = require("./auth");
const Chat = require('./chat');

/////////
var adminKey =
  "209df7d5282798c4e9f84a6320dd933b2cfe6049b9f189eb9b2ac2bdecf52944";



const discordConnection = {
  websocket: "",
  avatar: "",
  username: "",
};

const HISTORY_LENGTH = 40,
  USE_CLIENT_TIMESTAMPS = false,
  LOG_TO_DISCORD = false,
  SHOW_JOIN_MESSAGES = false,
  REPEATED_MESSAGES_LOOKBACK = 3; // number of messages looked back to see if the message is a repeat

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

var usersOnline = {};
var bans = {};

app.use(express.static("public"));

app.use(auth);
app.get("/", (req, res) => {
  console.log(req.user);
  res.statusCode = 200;
  res.end(fs.readFileSync('index.html'));
});



io.on("connection", async (socket) => {
  var fp = socket.handshake.query.fp;
  if (fp) {
    hashedFp = createHash("sha256").update(fp).digest("hex").substring(0, 9);
    if (bans[hashedFp] == undefined) {
      socket.chat_id = hashedFp;
    } else {
      socket.emit("urBanned", JSON.stringify(bans[hashedFp]));
      setTimeout(() => {
        socket.disconnect();
      }, 500);
      return 0;
    }
  } else {
    return socket.disconnect();
  }
  usersOnline[socket.chat_id] = {
    username: "?",
  };
  io.sockets.emit("updateUsersOnline", Object.keys(usersOnline).length);
  socket.emit(
    "appendChat",
    JSON.stringify({
      msgs: getHistory(),
      isHistoryMsgs: true,
    }),
  );

  socket.on("updateUsername", (data) => {
    if (data.username != null) {
      try {
        usersOnline[socket.chat_id].username = data.username.substring(0, 30);
        usersOnline[socket.chat_id].socket = socket;
      } catch (err) {
        console.log("why is this happening");
        console.log(data);
      }
    }
    if (data.joined && SHOW_JOIN_MESSAGES) {
      var msg = {
        msg: `${usersOnline[socket.chat_id].username} has joined`,
        username: "SERVER",
        id: 0,
        timestamp: new Date().getTime(),
        serverMsg: true,
      };
      io.sockets.emit(
        "appendChat",
        JSON.stringify({
          msgs: [msg],
        }),
      );
    }
  });
  socket.on("submitChat", (data) => {
    // mine's more professional
    data = JSON.parse(data);
    data.msg = verifyMsg(data.msg, socket, data.key);
    console.log(data);
    if (containsSlurs(data.msg.msg)) {
      console.log(`${data.msg.username}(${data.msg.id}) tried to say a slur`);
      return socket.emit("noSlurs");
    }

    if (data.msg) {
      appendHistory(data.msg);

      io.sockets.emit(
        "appendChat",
        JSON.stringify({
          msgs: [data.msg],
        }),
      );
      //commandHandler(data.msg.msg, data.key)
    }
  });

  socket.on("disconnect", () => {
    io.sockets.emit("updateUsersOnline", Object.keys(usersOnline).length);
    if (false) {
      var msg = {
        msg: `${usersOnline[socket.chat_id].username} has disconnected`,
        username: "SERVER",
        id: 0,
        timestamp: new Date().getTime(),
        serverMsg: true,
      };
      io.sockets.emit(
        "appendChat",
        JSON.stringify({
          msgs: [msg],
        }),
      );
    }
    delete usersOnline[socket.chat_id];
  });
});
//harry was here
setInterval(() => {
  updateBans();
}, 1000);

appendHistory({
  msg: `Server restarted`,
  username: "SERVER",
  id: 0,
  timestamp: new Date().getTime(),
  serverMsg: true,
});

server.listen(8414, () => {
  console.log("listening on *:8414");
});
