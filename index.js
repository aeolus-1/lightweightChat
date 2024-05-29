
var exec = require('child_process').exec;
require('dotenv').config()
const process = require("process")
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);


const HISTORY_LENGTH = 40


const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});
app.get('/', (req, res) => {
    res.send('server');
});


chatHistory = []
function getHistory() {
    return chatHistory
}
function appendHistory(msg) {
    chatHistory.push(msg)
    if (chatHistory.length>HISTORY_LENGTH) {
        chatHistory.shift()
    }
}


function verifyMsg(msg, socket) {
    msg.id = socket.chat_id
    msg.msg = msg.msg.substring(0,300)
    msg.username = msg.username.substring(0,30)
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


server.listen(process.env.PORT || 8085, () => {
    console.log('listxwening on *:8085');
})

