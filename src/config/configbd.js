const oracledb = require('oracledb');

cns = {
    user: "INTERSEGURO",
    password: "123",
    connectString: "localhost/ORCL"
    //connectString: "172.17.0.2/ORCLCDB"
}


async function Open(sql, binds, autoCommit) {
    let cnn = await oracledb.getConnection(cns);
    let result = await cnn.execute(sql, binds, { autoCommit });
    cnn.release();
    return result;
}

exports.Open = Open;