var fs = require('fs');

var config = require('./config');
var model = require('./model');
var SM = require('./socket_manager');

var app = require('https').createServer(config.https_options);
var io = require('./../../node_modules/socket.io').listen(app, {log: config.debug});
app.listen(config.port);

io.on('connection', onconnection);
var RM = require('./room').init(io, SM);

function onconnection(socket) {
    socket.emit('connection');
    socket.on('disconnect', ondisconnect);
    socket.on('joinroom', onjoinroom);
    socket.on('chatmessage', onchatmessage);
    socket.on('presence', onpresence);

} //onconnection

function onjoinroom(data) {
    if (!data.consult_id || !data.user || !data.user.user_id)
        return;

    var socket = this; //cache

    //gan bien
    SM.set(socket, 'consult_id', data.consult_id);
    SM.set(socket, 'user', data.user);

    var room = RM.get_instance(data.consult_id);
    SM.set(socket, 'room', room);
    room.join(socket, join_successed);

    function join_successed(nuve_token) {
        socket.broadcast_message('presence', {user: data.user, status: "online", type: "set", from: socket.id});
        socket.emit('nuve', {token: nuve_token});

        model.qry_consult_users(data.consult_id, function(rows) {
            socket.emit('updateusers', {arr_users: rows});
                    model.get_messages(data.consult_id, data.user.user_id, function(r) {
                        socket.emit('chatmessages', {arr_messages: r});
                });
        });
    }
}

function onpresence(data){
        var socket_from = this;
        var user = data.user;
        var uid = user.user_id;
        var from = socket_from.id;
        var to = data.to;
        var room = SM.get(socket_from, 'room');
        var socket_to = room.get_socket(to);
        
        if(!socket_to)
                return;
        data.from = socket_from.id;
        socket_to.emit("presence", data);
}

function ondisconnect() {
    var socket = this;
    var room = SM.get(socket, 'room');
    if (!socket || !room)
        return;
    room.leave(socket);
    
}

function onchatmessage(message) {
    var consult_id = SM.get(this, 'consult_id');
    message.date = new Date();
    this.broadcast_message('singlechatmessage', message);
    model.insert_message(consult_id, message);
}
