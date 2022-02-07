const mysql = require("mysql2/promise");

module.exports = async () => {
  var connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "old_tyho",
    port: "3307",
  });

  var connection1 = mysql.createPool({
    host: "localhost",
    port: "3307",

    user: "root",
    password: "",
    database: "tyho_live_old_db",
  });

  return { connection, connection1 };
};
