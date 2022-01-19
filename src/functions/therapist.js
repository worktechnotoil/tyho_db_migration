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

  arr.map((value, index) => {
    rows3.map((val, i) => {
      if (value[5] == val.user_login) {
        arr[index].push(val.user_email);
      }
    });
  });

  arr.map((val, i) => {
    if (val[7]) {
    } else {
      arr[i].push(null);
    }
  });

  console.log(arr);

  var sql =
    "INSERT INTO users (post_id,dial_code, usertype, first_name,middle_name,last_name,mobile_no,email) VALUES ?";

  const [rows4, fields4] = await db.connection1.query(sql, [arr]);
};
