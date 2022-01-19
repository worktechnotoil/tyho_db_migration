const mysql = require("mysql2/promise");

module.exports = async () => {
  var connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tyho_old",
  });

  var connection1 = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tyho_test",
  });

  return { connection, connection1 };
};
