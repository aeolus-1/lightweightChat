const process = require("process")
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

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

app.use(express.static('public'))

app.get('/', (req, res) => {
    console.log("hey")
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
    return msg
}



io.on('connection', async(socket) => {
    socket.chat_id = Math.floor(Math.random()*10e8)
   
    socket.emit("appendChat", JSON.stringify({
        msgs:getHistory()
    }))
    
    socket.on('submitChat', (data) => {
        data = JSON.parse(data)
        data.msg = verifyMsg(data.msg, socket)

        appendHistory(data.msg)

        io.sockets.emit("appendChat", JSON.stringify({
            msgs:[data.msg],
        }))

    });

})


server.listen(8414, () => {
    console.log('listening on *:8414');
})

