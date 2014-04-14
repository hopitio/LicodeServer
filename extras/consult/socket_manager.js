var arrData = {};

exports.set = function(socket, key, val) {
    var id = socket.id;
    if (!arrData[id])
        arrData[id] = {};
    arrData[id][key] = val;
};

exports.get = function(socket, key) {
    var id = socket.id;
    if (arrData[id] && arrData[id][key])
        return arrData[id][key];
    else
        return null;
};

