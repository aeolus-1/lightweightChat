const fetch = require("cross-fetch")
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { createHash } = require('crypto');
//
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

      LOG_TO_DISCORD = true,

      REPEATED_MESSAGES_LOOKBACK = 3 // number of messages looked back to see if the message is a repeat


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
        allowed_mentions: {
            "parse": []
        }
    }
    fetch("https://discord.com/api/webhooks/1245304028624326698/vbQGegNrDrj_Wrn0pCef01pFz3aDaw2njcjVVKI38KK1T2C8w2xNYdX2rsU_0aIzQJZN", {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(params)
    })
}

function normaliseString(string) {
    return string.trim().toLowerCase()
    
}

function verifyMsg(msg, socket, cmdKey) {
    msg.msg = msg.msg.substring(0,300)
    msg.id = socket.chat_id
    msg.username = msg.username.substring(0,30)
    msg.timestamp = (USE_CLIENT_TIMESTAMPS)?msg.timestamp:(new Date()).getTime()

    if (Commands.runText(msg.msg, socket, cmdKey)) {
        return false
    }
    
    if (msg.msg.trim().length<=0) {
        return false
    }

    function r(string, id) {return normaliseString(string)+`|${id}`}

    let lastMsgs = getHistory()
    lastMsgs = lastMsgs.slice(lastMsgs.length-REPEATED_MESSAGES_LOOKBACK, lastMsgs.length)
    lastMsgs = lastMsgs.map((e)=>{return r(e.msg,e.id)})

    if (lastMsgs.includes(r(msg.msg,msg.id))) {
        return false
    }

    
    return msg
}

class Commands {
    static cmds = {
        "/void_cmd":function(e, socket){
            // socket.emit("call", data) to emit to client that made command
        },
        "/command_with_input[":function(e, socket){
            //e is the string after the [
        },


        "/userlist":function(e, socket){
            var text = "Current Users Online: \n"
            for (const [key, value] of Object.entries(usersOnline)) {
                text += `[${key}] ${value.username}\r\n \r\n`
            }
            var msg = {
                msg:text,
                username:"SERVER",
                id: 0,
                timestamp:(new Date()).getTime(),
            } 
            socket.emit("appendChat", JSON.stringify({
                msgs:[msg],
            }))
        },
        "/ping":function(e, socket){
            var msg = {
                msg:"pong",
                username:"SERVER",
                id: 0,
                timestamp:(new Date()).getTime(),
            } 
            socket.emit("appendChat", JSON.stringify({
                msgs:[msg],
            }))
        },
        
    }
    static runText(text, socket, cmdKey, execute=true) {
        var foundCmd = false,
            parameter = text.slice(text.search(/\[/)+1, text.length),
            cmdStr  = text.slice(0, ((text.search(/\[/)+1)||text.length+1)),

            isAdmin = false


        if (cmdKey) {
            var hash =  createHash('sha256').update(cmdKey).digest('hex');
            if (hash == adminKey) {isAdmin = true}
        }

        console.log(parameter, cmdStr)
        if (true) {
            Object.keys(Commands.cmds).forEach(cmd => {
                var cmdOb = Commands.cmds[cmd]
                if (cmdStr == cmd) {
                    foundCmd = true
                    parameter = (parameter==undefined||parameter=="")?1:parameter
                    if (execute) cmdOb(parameter, socket)
                }
            });
        }

        return foundCmd
    }
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
        if (data !=null) usersOnline[socket.chat_id].username = data.substring(0,30)
    })
    socket.on('submitChat', (data) => {
        // mine's more professional
        data = JSON.parse(data)
        data.msg = verifyMsg(data.msg, socket, data.key)
        if (data.msg) {
            appendHistory(data.msg)

            io.sockets.emit("appendChat", JSON.stringify({
                msgs:[data.msg],
            }))
            //commandHandler(data.msg.msg, data.key)
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

