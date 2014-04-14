var fs = require('fs');

exports.port = 8000;

exports.debug = true;

exports.db_host = '172.16.10.206';

exports.db_user = 'root';

exports.db_pass = 'root';

exports.db_name = 'ehr';

//certificate
exports.https_options = {
    key: fs.readFileSync(__dirname + '/../../cert/server.key'),
    cert: fs.readFileSync(__dirname + '/../../cert/server.crt'),
    ca: fs.readFileSync(__dirname + '/../../cert/server.pem'),
    log: exports.debug
};

exports.nuve_host = 'http://localhost:3000/';

//licode
exports.rabbit = {};
exports.nuve = {};
exports.erizoController = {};
exports.cloudProvider = {};
exports.erizo = {};

exports.rabbit.host = 'localhost';
exports.rabbit.port = 5672;

exports.nuve.dataBaseURL = "localhost/nuvedb";
exports.nuve.superserviceID = '53086cc9a814868e3f584f4f';
exports.nuve.superserviceKey = '25';
exports.nuve.testErizoController = 'localhost:8080';

//Use undefined to run clients without Stun 
exports.erizoController.stunServerUrl = 'stun:stun.l.google.com:19302';

exports.erizoController.defaultVideoBW = 300;
exports.erizoController.maxVideoBW = 300;

//Public erizoController IP for Nuve (useful when behind NATs)
//Use '' to automatically get IP from the interface
exports.erizoController.publicIP = '';

//Use undefined to run clients without Turn
exports.erizoController.turnServer = {};
exports.erizoController.turnServer.url = '';
exports.erizoController.turnServer.username = '';
exports.erizoController.turnServer.password = '';

exports.erizoController.warning_n_rooms = 15;
exports.erizoController.limit_n_rooms = 20;
exports.erizoController.interval_time_keepAlive = 1000;

//STUN server IP address and port to be used by the server.
//if '' is used, the address is discovered locally
exports.erizo.stunserver = '';
exports.erizo.stunport = 0;

//note, this won't work with all versions of libnice. With 0 all the available ports are used
exports.erizo.minport = 0;
exports.erizo.maxport = 0;

exports.cloudProvider.name = '';
//In Amazon Ec2 instances you can specify the zone host. By default is 'ec2.us-east-1a.amazonaws.com' 
exports.cloudProvider.host = '';
exports.cloudProvider.accessKey = '';
exports.cloudProvider.secretAccessKey = '';

// Roles to be used by services
exports.roles = {"presenter": ["publish", "subscribe", "record"], "viewer": ["publish", "subscribe"]};
