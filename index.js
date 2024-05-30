const fetch = require("cross-fetch")
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { createHash } = require('crypto');

var adminKey = "415f637bb8f7661bb08aa264dd85912ee539a1a639b294fda18bb5087fe914a0"
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

      LOG_TO_DISCORD = true


const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});

var usersOnline = {}

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


chatHistory = []
function getHistory() {
    return chatHistory
}
function appendHistory(msg) {
    chatHistory.push(msg)
    if (LOG_TO_DISCORD) {
        postMessageToDiscord(msg)
    }



    if (chatHistory.length>HISTORY_LENGTH) {
        chatHistory.shift()
    }
}

function parseMsgString(msg) {
    return `[${(new Date(msg.timestamp)).toLocaleDateString()} ${(new Date(msg.timestamp)).toLocaleTimeString()}] [?] [${msg.username} (${msg.id})] ${msg.msg}`
}

function postMessageToDiscord(msg) {
    let msgString = parseMsgString(msg)
    var params = {
        username: "Chat Logger",
        avatar_url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.csr-online.net%2Fwp-content%2Fuploads%2F2020%2F06%2Fpeople-speech-bubbles-chatting-communication-concept-vector-illustration-141568372.jpg",
        content: msgString,
    }
    fetch("https://discord.com/api/webhooks/1245304028624326698/vbQGegNrDrj_Wrn0pCef01pFz3aDaw2njcjVVKI38KK1T2C8w2xNYdX2rsU_0aIzQJZN", {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(params)
    })
}


function verifyMsg(msg, socket) {
    msg.id = socket.chat_id
    msg.msg = msg.msg.substring(0,300)
    msg.username = msg.username.substring(0,30)
    msg.timestamp = (USE_CLIENT_TIMESTAMPS)?msg.timestamp:(new Date()).getTime()
    if (msg.msg.trim().length<=0) {
        return false
    }
    return msg
}



io.on('connection', async(socket) => {
    socket.chat_id = Math.floor(Math.random()*10e8)
   usersOnline[socket.chat_id] = {
    username: "?"
   }
   io.sockets.emit("updateUsersOnline", Object.keys(usersOnline).length)
    socket.emit("appendChat", JSON.stringify({
        msgs:getHistory(),
        isHistoryMsgs:true,
    }))



    socket.on('updateUsername', (data) => {
        usersOnline[socket.chat_id].username = data
    })
    socket.on('submitChat', (data) => {
        // mine's more professional
        data = JSON.parse(data)
        data.msg = verifyMsg(data.msg, socket)
        if (data.msg) {
            appendHistory(data.msg)

            io.sockets.emit("appendChat", JSON.stringify({
                msgs:[data.msg],
            }))
            commandHandler(data.msg.msg, data.key)
        }

        

    });

    socket.on("disconnect", () => {
       delete usersOnline[socket.chat_id]
        io.sockets.emit("updateUsersOnline", Object.keys(usersOnline).length)
      });

})


server.listen(8414, () => {
    console.log('listening on *:8414');
})

function commandHandler(msg, key) {
    let admin = false
    if (key) {
       var hash =  createHash('sha256').update(key).digest('hex');
       console.log(hash)
       if (hash == adminKey) {admin = true}
    }
    if (msg.includes("/userlist")) {
        var text = "Current Users Online: \n"
        for (const [key, value] of Object.entries(usersOnline)) {
            text += `${key} - ${value.username}\n`
        }
        var msg = {
            msg:text,
            username:"SERVER",
            id: 0,
            timestamp:(new Date()).getTime(),
        } 
        io.sockets.emit("appendChat", JSON.stringify({
            msgs:[msg],
        }))
    }
}
