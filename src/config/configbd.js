const oracledb = require('oracledb');

cns = {
    user: "outreporte",
    password: "OUTREPORTE",
    connectString: "172.17.100.123:1521/upcht3"
    //connectString: "172.17.0.2/ORCLCDB"
}


async function Open(sql, binds, autoCommit) {
    let cnn = await oracledb.getConnection(cns);
    let result = await cnn.execute(sql, binds, { autoCommit });
    cnn.release();
    return result;
}

exports.Open = Open;