const connect = require("../utils/connect");
const moment = require("moment");

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

  const users = ["first-name", "middle-name", "last-name", "phone-number","languages"];

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

        // console.log(result1.meta_key);
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

  var CurrentDate = moment().format("YYYY-MM-DD HH:mm:ss");


  console.log(user);

  // for (const records of user) 
  // {
  //   // console.log(records);

  //   records[records.length] = CurrentDate;
  //   records[records.length] = CurrentDate;
  //   // console.log(records);

  //   var sql =
  //   "INSERT INTO users (usertype,post_id,mobile_no,email,dial_code,first_name,last_name,middle_name,created_at,updated_at) VALUES ?";

  //   const [rows5, fields5] = await db.connection1.query(sql, [[records]]);

  //   var user_id = rows5.insertId;
  //   var user_type = records[0];

  //   const firstName = records[5];
   
  //   const Username = firstName.substr( 0, 3);
  //   const UserID = Username + "_" + user_id;
  //   await db.connection1.query('UPDATE users SET ? WHERE id = ?', [{ "user_id": UserID }, user_id]);

  //   // therapist_details insert
  //   if (user_type == 2)
  //   {
      
  //     var values_therapist_details = [[1,1,5,user_id,"Asia/Singapore",CurrentDate,CurrentDate]];
  //     var sql =
  //     "INSERT INTO therapist_details (service_id_fk,medium_id_fk,country_id_fk,therapist_id_FK,my_timezone,created_at,updated_at) VALUES ?";
  //     const [rows6, fields6] = await db.connection1.query(sql, [values_therapist_details]);
  //   }

    

  // }
  // 

  console.log("Insertion complete");

  async function getLanguageId(languages) {
    
    var education = "<ul><li>English</li><li>Mandarin Chinese</li></ul>";
    education = education.replace("<ul><li>", "");
    education = education.replace("</li></ul>", "");
    const educationArray = education.split("</li><li>");

    var array_education = [];


    for (const records of educationArray) 
    {
      const [rows, fields] = await db.connection1.query('SELECT * FROM `languages` WHERE language_name = ?', [ records]);

      if (rows.length > 0)
      {
        array_education.push(rows[0].id);
      }else
      {
        var values = [[records,1,CurrentDate,CurrentDate ]];
        var sql_languages =
        "INSERT INTO languages (language_name,status,created_at,updated_at) VALUES ?";
        const [rows1, fields1] = await db.connection1.query(sql_languages, [values]);
        array_education.push(rows1.insertId);
      }
    }

  }
};
