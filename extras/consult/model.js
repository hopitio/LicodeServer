var mysql = require('mysql');
var config = require('./config.js');

var retry_count = 0;

/**
 * @private
 * @returns {undefined}
 * @throws err
 */
var retry_connect = function(DB) {
    if (retry_count < 3) {
        exports.connect(DB);
    }
};

exports.connect = function(DB) {
    //tao doi tuong
    DB = mysql.createConnection({
        host: config.db_host,
        user: config.db_user,
        password: config.db_pass,
        database: config.db_name
    });
    //ket noi
    DB.connect(function(err) {
        if (err) {
            retry_connect(DB);
        }
    });
    return DB;
};

exports.disconnect = function(DB) {
    if (DB !== null) {
        DB.end();
        DB = null;
    }
};

exports.qry_consult_users = function(consult, callback) {
    var DB = exports.connect();
    var sql = "Select U.PK_USER as user_id, U.C_NAME as name, U.C_LOGIN_NAME as login_name, CU.C_STATUS as status"
            + " , OU.C_NAME as ou_name, U.C_JOB_TITLE as job_title"
            + " , U.PK_USER=C.FK_HOST_USER as is_host"
            + " , U.PK_USER=C.FK_REQUEST_USER as is_requester"
            + " , AU.FK_USER As C_IS_ANONYMOUS"
            + " From t_ehr_consultation_user CU"
            + " Inner Join t_cores_user U On CU.FK_USER = U.PK_USER"
            + " Inner Join t_ehr_consultation C On C.PK_CONSULTATION = CU.FK_CONSULTATION"
            + " Inner Join t_cores_ou OU On U.FK_OU = OU.PK_OU"
            + " Left Join t_ehr_anonymous_user AU On AU.FK_USER = U.PK_USER"
            + " Where CU.FK_CONSULTATION=?";
    DB.query(sql, [consult], function(e, r) {
        callback(r);
        DB.end();
    });
};

exports.get_messages = function(consult_id, user_id, callback) {
    var DB = exports.connect();
    var sql = "Select CN.C_DATE as date, U.PK_USER as user_id, U.C_NAME as name, U.C_LOGIN_NAME as login_name"
            + " ,CN.C_TEXT as text"
            + " From t_ehr_consultation_note CN"
            + " Inner Join t_cores_user U On CN.FK_USER = U.PK_USER"
            + " Where CN.FK_CONSULTATION = ? Order By CN.C_DATE";
    DB.query(sql, [consult_id], function(e, r) {
        callback(r);
        DB.end();
    });
};

exports.insert_message = function(consult_id, data) {
    var DB = exports.connect();
    var sql = "Insert Into t_ehr_consultation_note(FK_CONSULTATION, FK_USER, C_TEXT, C_DATE)"
            + " Values(?,?,?,?)";
    var params = [consult_id, data.user_id, data.text, data.date];
    DB.query(sql, params, function(e) {
        DB.end();
    });
};
