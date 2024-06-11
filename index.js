const fetch = require("cross-fetch");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { createHash } = require("crypto");
const list = require("./badWords")
/////////
var adminKey =
  "209df7d5282798c4e9f84a6320dd933b2cfe6049b9f189eb9b2ac2bdecf52944";
/*
    message {
        msg: str
        username: str
        id: int (rand)
        timestamp: int (timestamp)
    }
*/

const HISTORY_LENGTH = 40,
  USE_CLIENT_TIMESTAMPS = false,
  LOG_TO_DISCORD = true,
  REPEATED_MESSAGES_LOOKBACK = 3; // number of messages looked back to see if the message is a repeat

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

var usersOnline = {};
var bans = {};

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

chatHistory = [];
function getHistory() {
  return chatHistory;
}
function appendHistory(msg) {
  chatHistory.push(msg);
  if (LOG_TO_DISCORD) {
    postMessageToDiscord(msg);
  }

  if (chatHistory.length > HISTORY_LENGTH) {
    chatHistory.shift();
  }
}

function parseMsgString(msg) {
  return `[${new Date(msg.timestamp).toLocaleDateString("en-AU")} ${new Date(
    msg.timestamp
  ).toLocaleTimeString("en-AU")}] [?] [${msg.username} (${msg.id})] ${msg.msg}`;
}

function containsSlurs(msg) {
  if (!msg) return
  msg = msg.replace(/ /g,'')
  msg = msg.replace(/[^a-zA-Z ]/g, "")
  console.log(`Message: ${msg}`)
  if (list.slurs.some(v => msg.includes(v))) {
    return true
}
}

function postMessageToDiscord(msg) {
  let msgString = parseMsgString(msg);
  var params = {
    username: "Chat Logger",
    avatar_url:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.csr-online.net%2Fwp-content%2Fuploads%2F2020%2F06%2Fpeople-speech-bubbles-chatting-communication-concept-vector-illustration-141568372.jpg",
    content: msgString,
    allowed_mentions: {
      parse: [],
    },
  };
  fetch(
    "https://discord.com/api/webhooks/1245304028624326698/vbQGegNrDrj_Wrn0pCef01pFz3aDaw2njcjVVKI38KK1T2C8w2xNYdX2rsU_0aIzQJZN",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(params),
    }
  );
}

function normaliseString(string) {
  return string.trim().toLowerCase();
}

function verifyMsg(msg, socket, cmdKey) {
  msg.msg = msg.msg.substring(0, 300);
  msg.id = socket.chat_id;
  msg.username = msg.username.substring(0, 30).replaceAll(" ", "");
  msg.timestamp = USE_CLIENT_TIMESTAMPS ? msg.timestamp : new Date().getTime();

  if (Commands.runText(msg.msg, socket, cmdKey)) {
    return false;
  }

  if (msg.msg.trim().length <= 0) {
    return false;
  }

  function r(string, id) {
    return normaliseString(string) + `|${id}`;
  }

  let lastMsgs = getHistory();
  lastMsgs = lastMsgs.slice(
    lastMsgs.length - REPEATED_MESSAGES_LOOKBACK,
    lastMsgs.length
  );
  lastMsgs = lastMsgs.map((e) => {
    return r(e.msg, e.id);
  });

  if (lastMsgs.includes(r(msg.msg, msg.id))) {
    return false;
  }

  return msg;
}

function addBan(id, duration) {
  bans[id] = {
    id: id,
    duration: duration,
    timestamp: new Date().getTime(),
  };

  let user = usersOnline[id];
  if (!user) return;
  if (user.socket != undefined) {
    user.socket.emit("urBanned", JSON.stringify(bans[id]));
    user.socket.disconnect();
  }
}
addBan(123456789, 300 * 1000);
function updateBans() {
  for (let i = 0; i < Object.keys(bans).length; i++) {
    const ban = bans[Object.keys(bans)[i]];
    let timeSince = new Date().getTime() - ban.timestamp;
    if (timeSince >= ban.duration) {
      delete bans[ban.id];
    }
  }
}
function removeBan(id) {
  for (let i = 0; i < Object.keys(bans).length; i++) {
    const ban = bans[Object.keys(bans)[i]];
    if (ban.id == id) {
      delete bans[ban.id];
    }
  }
}

class Commands {
  static cmds = {
    "/void_cmd": {
      callback: function (cmdInputs, socket) {
        // socket.emit("call", data) to emit to client that made command
        // cmdInputs is a array of strings of all the resulting parameters
      },
      adminOnly: false,
    },
    "/help": {
      callback: function (cmdInputs, socket) {
        let cmds = Object.keys(Commands.cmds),
          cList = [];
        for (let i = 0; i < cmds.length; i++) {
          const cmd = cmds[i];
          cList.push({
            msg: `- ${cmd}  ${
              Commands.cmds[cmd].adminOnly ? "[ADMIN COMMAND]" : ""
            }`,
            username: "SERVER",
            id: 0,
            timestamp: new Date().getTime(),
            serverMsg: true,
          });
        }

        socket.emit(
          "appendChat",
          JSON.stringify({
            msgs: cList,
          })
        );
      },
      adminOnly: false,
    },
    "/userlist": {
      callback: function (cmdInputs, socket) {
        console.log(cmdInputs);
        var text = "Current Users Online: \n";
        for (const [key, value] of Object.entries(usersOnline)) {
          text += `[${key}] ${value.username}\r\n \r\n`;
        }
        var msg = {
          msg: text,
          username: "SERVER",
          id: 0,
          timestamp: new Date().getTime(),
          serverMsg: true,
        };
        socket.emit(
          "appendChat",
          JSON.stringify({
            msgs: [msg],
          })
        );
      },
      adminOnly: false,
    },
    "/ping": {
      callback: function (cmdInputs, socket) {
        var msg = {
          msg: "pong",
          username: "SERVER",
          id: 0,
          timestamp: new Date().getTime(),
          serverMsg: true,
        };
        socket.emit(
          "appendChat",
          JSON.stringify({
            msgs: [msg],
          })
        );
      },
      adminOnly: false,
    },
    "/time": {
      callback: function (e, socket) {
        let time = new Date().toLocaleTimeString("en-AU");

        var msg = {
          msg: `Server time is ${time}`,
          username: "SERVER",
          id: 0,
          timestamp: new Date().getTime(),
          serverMsg: true,
        };
        socket.emit(
          "appendChat",
          JSON.stringify({
            msgs: [msg],
          })
        );
      },
      adminOnly: false,
    },
    "/getBans": {
      callback: function (e, socket) {
        console.log(bans);
        let banList = Object.keys(bans),
          cList = [];
        for (let i = 0; i < banList.length; i++) {
          const ban = bans[banList[i]];
          cList.push({
            msg: `-  ${ban.id}, ${Math.floor(
              (ban.duration - (new Date().getTime() - ban.timestamp)) / 1000
            )} seconds left`,
            username: "SERVER",
            id: 0,
            timestamp: new Date().getTime(),
            serverMsg: true,
          });
        }

        socket.emit(
          "appendChat",
          JSON.stringify({
            msgs: cList,
          })
        );
      },
      adminOnly: false,
    },
    "/ban": {
      callback: function (commandParameters, socket) {
        let idToBan = commandParameters[0],
          banDuration = parseFloat(commandParameters[1]);

        addBan(idToBan, banDuration * 1000);

        var username = usersOnline[idToBan];
        if (username != undefined) {
          username = ` and username of ${username.username}`;
        } else {
          username = "";
        }

        var msg = {
          msg: `User with id ${idToBan}${username} has been banned for ${banDuration} seconds`,
          username: "SERVER",
          id: 0,
          timestamp: new Date().getTime(),
          serverMsg: true,
        };
        appendHistory(msg);
        io.sockets.emit(
          "appendChat",
          JSON.stringify({
            msgs: [msg],
          })
        );
      },
      adminOnly: true,
    },
    "/clearBan": {
      callback: function (e, socket) {
        removeBan(e[0]);
        var msg = {
          msg: `Unbanned User with id ${e[0]}`,
          username: "SERVER",
          id: 0,
          timestamp: new Date().getTime(),
          serverMsg: true,
        };
        socket.emit(
          "appendChat",
          JSON.stringify({
            msgs: [msg],
          })
        );
      },
      adminOnly: true,
    },
    "/clearHistory": {
      callback: function (cmdInputs, socket) {
        chatHistory = [];

        var msg = {
          msg: `History cleared by admin`,
          username: "SERVER",
          id: 0,
          timestamp: new Date().getTime(),
          serverMsg: true,
        };
        io.sockets.emit(
          "appendChat",
          JSON.stringify({
            msgs: [msg],
          })
        );
      },
      adminOnly: true,
    },
    "/sendServerMsg": {
      callback: function (cmdInputs, socket) {
        if (cmdInputs.length < 1) {
          return 0;
        }

        var msg = {
          msg: cmdInputs.join(" "),
          username: "SERVER",
          id: 0,
          timestamp: new Date().getTime(),
          serverMsg: true,
        };
        appendHistory(msg);
        io.sockets.emit(
          "appendChat",
          JSON.stringify({
            msgs: [msg],
          })
        );
      },
      adminOnly: true,
    },
    "/forceReload": {
      callback: function (cmdInputs, socket) {
        io.sockets.emit("forceReload");
      },
      adminOnly: true,
    },
    "/modifyUsername": {
      callback: function (cmdInputs, socket) {
        console.log(
          `attempting to change username ${cmdInputs[0]} to ${cmdInputs[1]}`
        );
        io.sockets.emit(
          "modifyUsername",
          JSON.stringify({
            curName: cmdInputs[0],
            newName: cmdInputs[1],
          })
        );
        for (let i = 0; i < io.sockets.length; i++) {
          const socket = io.sockets[i];
          if (socket.chat_id == cmdInputs[0]) {
            socket.emit(
              "forceModifyUsername",
              JSON.stringify({
                newName: cmdInputs[1],
              })
            );
          }
        }
      },
      adminOnly: true,
    },
  };
  static runText(text, socket, cmdKey, execute = true) {
    var foundCmd = false,
      rawCmdParams = text.split(" "),
      cmdParams = rawCmdParams.slice(1, rawCmdParams.length),
      cmdStr = rawCmdParams.slice(0, 1),
      isAdmin = false;

    if (cmdKey) {
      var hash = createHash("sha256").update(cmdKey).digest("hex");
      if (hash == adminKey) {
        isAdmin = true;
      }
    }
    if (true) {
      Object.keys(Commands.cmds).forEach((cmd) => {
        var cmdOb = Commands.cmds[cmd];
        if (cmdStr == cmd && (cmdOb.adminOnly ? isAdmin : true)) {
          foundCmd = true;
          if (execute) cmdOb.callback(cmdParams, socket);
        }
      });
    }

    return foundCmd;
  }
}

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
    })
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
    if (data.joined && false) {
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
        })
      );
    }
  });
  socket.on("submitChat", (data) => {
    // mine's more professional
    data = JSON.parse(data);
    data.msg = verifyMsg(data.msg, socket, data.key);
    console.log(data)
    if (containsSlurs(data.msg.msg)) {
      console.log(`${data.msg.username}(${data.msg.id}) tried to say a slur`)
      return socket.emit("noSlurs")
    }

    if (data.msg) {
      appendHistory(data.msg);

      io.sockets.emit(
        "appendChat",
        JSON.stringify({
          msgs: [data.msg],
        })
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
        })
      );
    }
    delete usersOnline[socket.chat_id];
  });
});
//harry was here
setInterval(() => {
  updateBans();
}, 1000);

var tmsg = {
  msg: `Server restarted`,
  username: "SERVER",
  id: 0,
  timestamp: new Date().getTime(),
  serverMsg: true,
};
appendHistory(tmsg);

server.listen(8414, () => {
  console.log("listening on *:8414");
});
