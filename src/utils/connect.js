const mysql = require("mysql2/promise");

module.exports = async () => {
  var connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "old_tyho",
  });

  var connection1 = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tyho_dev_21jan",
  });

  return { connection, connection1 };
};
