
const express = require('express');
const path = require('path');
//const RedisClient = require('ioredis');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//const redisClient = new RedisClient();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use('/', (req, res) => {
    res.render('index.html');
})

let messages = [];


io.on('connection', socket => {

    socket.emit('previousMessages', messages);
 
    socket.on('login', async (user) => {
        await redisClient.set(`user.${socket.id}.session`, JSON.stringify(user));
        const message = {
            author: user.name,
            message: user.message,
        }
        socket.emit('message', message);
    })
    
    socket.emit('previousMessages', messages);


    socket.on('sendMessage', (data) => {
        messages.push(data);

        socket.broadcast.emit('receivedMessage', data)
    });
})




server.listen(3000)

