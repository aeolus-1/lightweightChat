const fetch = require("cross-fetch");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { createHash } = require("crypto");
var fs = require("fs");

require('dotenv').config()

/*
.env {
  discord_url: string,
  auth_user: string,
  auth_pass: string,
}
*/

/////////

const auth = require("./auth");
const Chat = require("./chat");

/////////
var adminKey =
  "209df7d5282798c4e9f84a6320dd933b2cfe6049b9f189eb9b2ac2bdecf52944";

const discordConnection = {
  websocket: process.env.discord_url||"",
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

const chat = new Chat(
  {
    HISTORY_LENGTH: HISTORY_LENGTH,
    USE_CLIENT_TIMESTAMPS: USE_CLIENT_TIMESTAMPS,
    LOG_TO_DISCORD: LOG_TO_DISCORD,
    SHOW_JOIN_MESSAGES: SHOW_JOIN_MESSAGES,
    REPEATED_MESSAGES_LOOKBACK: REPEATED_MESSAGES_LOOKBACK,
    discordConnection:discordConnection,
    adminKey:adminKey
  },
  io,
);

app.use(express.static("public"));

app.use(auth);
app.get("/", (req, res) => {
  console.log(req.user);
  res.statusCode = 200;
  res.end(fs.readFileSync("index.html"));
});

io.on("connection", async (socket) => {
  var fp = socket.handshake.query.fp;
  if (fp) {
    hashedFp = createHash("sha256").update(fp).digest("hex").substring(0, 9);
    if (chat.bans[hashedFp] == undefined) {
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
  chat.usersOnline[socket.chat_id] = {
    username: "?",
  };
  io.sockets.emit("updateUsersOnline", Object.keys(chat.usersOnline).length);
  socket.emit(
    "appendChat",
    JSON.stringify({
      msgs: chat.getHistory(),
      isHistoryMsgs: true,
    }),
  );

  socket.on("updateUsername", (data) => {
    if (data.username != null) {
      try {
        chat.usersOnline[socket.chat_id].username = data.username.substring(
          0,
          30,
        );
        chat.usersOnline[socket.chat_id].socket = socket;
      } catch (err) {
        console.log("why is this happening");
        console.log(data);
      }
    }
    if (data.joined && SHOW_JOIN_MESSAGES) {
      var msg = {
        msg: `${chat.usersOnline[socket.chat_id].username} has joined`,
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
    data.msg = chat.verifyMsg(data.msg, socket, data.key);
    console.log(data);
    if (chat.containsSlurs(data.msg.msg)) {
      console.log(`${data.msg.username}(${data.msg.id}) tried to say a slur`);
      return socket.emit("noSlurs");
    }

    if (data.msg) {
      chat.appendHistory(data.msg);

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
    io.sockets.emit("updateUsersOnline", Object.keys(chat.usersOnline).length);
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
    delete chat.usersOnline[socket.chat_id];
  });
});
//harry was here
setInterval(() => {
  chat.updateBans();
}, 1000);

chat.appendHistory({
  msg: `Server restarted`,
  username: "SERVER",
  id: 0,
  timestamp: new Date().getTime(),
  serverMsg: true,
});

server.listen(8414, () => {
  console.log("listening on *:8414");
});
