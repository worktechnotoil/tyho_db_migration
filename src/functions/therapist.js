const connect = require("../utils/connect");
//"SELECT * FROM xalfyiBase_postmeta"

module.exports = async () => {
  const db = await connect();
  const arr = [];
  const number = [];
  const field = [
    "clients-types",
    "communication-pref",
    "education",
    "please-include-a-description-about-yourself-for-your-profile",
    "languages",
    "first-name",
    "middle-name",
    "last-name",
    "phone-number",
    "current-occupation",
    "length-of-experience",
    "area-of-expertise-specialisation",
    "full_name",
    "therapeutic-approaches",
    "current--last-place-of-practice",
    "educational-qualifications",
    "professional-certifications",
    "professional-memberships",
    "specific-groups",
    "not-to-work-with",
    "teenagers",
    "preferred-modes-of-communication",
    "available-time-slots",
    "_appointment_user_reminder_sent",
    "approximate-availability-hours-per-week",
  ];

  const users = ["first-name", "middle-name", "last-name", "phone-number"];

  const users1 = [
    { key: "first-name", ch: "first_name" },
    { key: "middle-name", ch: "middle_name" },
    { key: "last-name", ch: "last_name" },
    { key: "phone-number", ch: "" },
    // { key: "current-occupation", ch: "usertype" },//hard coded
    // { key: "length-of-experience", ch: "email" },
    // { key: "area-of-expertise-specialisation", ch: "dial_code" },//hard coded
    //  { key: "languages", ch: "mobile_no" }
  ];

  const [rows, fields] = await db.connection.execute(
    "SELECT * FROM `xalfyiBase_posts` WHERE `post_type` LIKE 'tyho-wellbeing-coach'"
  );
  const [rows1, fields1] = await db.connection.execute(
    "SELECT * FROM xalfyiBase_postmeta"
  );
  const [rows3, fields3] = await db.connection.execute(
    "SELECT * FROM xalfyiBase_users"
  );
  const [rows4, fields4] = await db.connection.execute(
    "SELECT * FROM xalfyiBase_usermeta"
  );

  rows.map((result) => {
    let obj = [];
    obj.push(result.ID);
    obj.push("+65");
    obj.push("2");
    rows1.map((result1) => {
      if (result1.post_id === result.ID) {
        if (users.includes(result1.meta_key)) {
          const ke = result1.meta_key;
          obj.push(result1.meta_value);
        }
      }
    });
    arr.push(obj);
  });
  let ids = [];
  arr.map((val, i) => {
    rows3.map((val1, i1) => {
      if (val[6] == val1.user_login) {
        ids.push(val1.ID);
        val.push(val1.ID, val1.user_email);
      }
    });
  });

  let user = [];
  rows3.map((val, i) => {
    let ar = [];
    if (ids.includes(val.ID)) {
      ar.push(2);
    } else {
      ar.push(3);
    }
    ar.push(val.ID, val.user_login, val.user_email, "+65");
    user.push(ar);
  });

  user.map((val, i) => {
    rows4.map((val1, i1) => {
      if (val[1] == val1.user_id) {
        if (val1.meta_key == "first_name") {
          val.push(val1.meta_value);
        }
        if (val1.meta_key == "last_name") {
          val.push(val1.meta_value);
        }
        if (val1.meta_key == "middlename") {
          val.push(val1.meta_value);
        }
      }
    });
    if (val.length == 7) {
      val.push("");
    }
  });

  var sql =
    "INSERT INTO users (usertype,post_id,mobile_no,email,dial_code,first_name,last_name,middle_name) VALUES ?";

  const [rows5, fields5] = await db.connection1.query(sql, [arr]);
};
