var N = require('./nuve');
var config = require('./config');

var io;
var SM;
var arr_rooms = {};

exports.init = function(_io, _sm) {
    SM = _sm;
    io = _io;
    N.API.init(config.nuve.superserviceID, config.nuve.superserviceKey, config.nuve_host);

    return exports;
};

exports.get_instance = function(room_id) {
    if (!arr_rooms[room_id])
        arr_rooms[room_id ] = new chat_room(room_id);
    return arr_rooms[room_id];
};

function chat_room(room_id) {
    var croom = this; //cache
    croom.id = room_id;
    croom.nuve;

    croom.get_sockets = function() {
        return io.sockets.clients(room_id);
    };
    
    croom.get_socket = function(socket_id){
        var arr = croom.get_sockets();
        for(var i in arr){
            var socket = arr[i];
            if(socket.id === socket_id)
                return socket;
        }
    }

    croom.get_users = function() {
        var arr_sockets = croom.get_sockets();
        var arr_users = [];
        for (var i in arr_sockets) {
            var socket = arr_sockets[i];
            var found = false;
            var user = SM.get(socket, 'user');
            for (var j in arr_users) {
                var uid = arr_users[j];
                if (parseInt(uid) === parseInt(user.user_id)) {
                    found = true;
                    break;
                }
            }
            if (!found)
                arr_users.push(user.user_id);
        }
        return arr_users;
    };

    croom.join = function(socket, callback) {
        socket.join(room_id);
        socket.broadcast_message = function(event, data) {
            socket.broadcast.to(room_id).emit(event, data);
        };
        if (!croom.nuve) {
            N.API.createRoom(croom.id, function(nuve_id) {
                croom.nuve = nuve_id;
                got_nuve_id(croom.nuve);
            });
            console.log('create nuve');
        } else {
            got_nuve_id(croom.nuve);
        }

        function got_nuve_id(nuve) {
            N.API.createToken(nuve._id, socket.id, 'presenter', callback);
        }
    };

    croom.leave = function(socket) {
        var user = SM.get(socket, "user");
        socket.leave(room_id);
        console.log("asdsa");
        socket.broadcast.to(croom.id).emit("presence", {user: user, status: "unavailable"});
    };
}

