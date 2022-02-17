const mysql = require("mysql2/promise");

module.exports = async () => {
  var connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "talkyourheartoutapp",
    port: "3307",
  });

  var connection1 = mysql.createPool({
    host: "localhost",
    port: "3307",

    user: "root",
    password: "",
    database: "latest_live",
  });

  return { connection, connection1 };
};
