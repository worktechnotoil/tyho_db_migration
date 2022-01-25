const connect = require("../utils/connect");
const moment = require("moment");
var unserialize=require("php-serialization").unserialize;

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

  
  var CurrentDate = moment().format("YYYY-MM-DD HH:mm:ss");

  async function getLanguageId() {
    
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
    return array_education.join();
  }

  async function getCommunicationPref(value) {
    var array = [];
    var result=unserialize(value);
    for(var attributename in result.__attr__){
  
      const [rows, fields] = await db.connection1.query('SELECT * FROM `mediums` WHERE medium = ?', [ result.__attr__[attributename].val]);
      // console.log(rows);
      // console.log(result.__attr__[attributename].val);
      if (rows.length > 0)
      {
        array.push(rows[0].id);
      }
    }
    return array.join();   
  }

  var applicationForm = [];

  // console.log(rows1);
  // return;


  // for (const result of rows1) {
  //   console.log(result);
  // }
  // for (const result in rows1) {
    
  //   console.log(result);
  // }

  // return;

  for (const result of rows) {
  // rows.map((result) => {
    let obj = [];
    obj.push(result.ID);
    obj.push("+65");
    obj.push("2");

    let applicationFormobj = {};
    applicationFormobj.post_id = result.ID;
    for (const result1 of rows1) {
    // rows1.map((result1) => {
      if (result1.post_id === result.ID) {

        // console.log(result1.meta_key);
        if (users.includes(result1.meta_key)) {
          const ke = result1.meta_key;
          obj.push(result1.meta_value);
        }

        if (result1.meta_key == "first-name")
        {
          applicationFormobj.first_name = result1.meta_value;
        }

        if (result1.meta_key == "middle-name")
        {
          applicationFormobj.middle_name = result1.meta_value;
        }

        if (result1.meta_key == "last-name")
        {
          applicationFormobj.last_name = result1.meta_value;
        }

        if (result1.meta_key == "phone-number")
        {
          applicationFormobj.phone_number = result1.meta_value;
        }

       
        if (result1.meta_key == "languages")
        {
          var languages =  await getLanguageId(result1.meta_value);
          applicationFormobj.languages = languages;
          // obj.push(languages);
        }

        if (result1.meta_key == "languages")
        {
          var languages =  await getLanguageId(result1.meta_value);
          applicationFormobj.languages = languages;
          // obj.push(languages);
        }

        if (result1.meta_key == "education")
        {
          applicationFormobj.education = result1.meta_value;
          // obj.push(result1.meta_value);
        }
        
        
        if (result1.meta_key == "communication-pref")
        {
          var medium = await getCommunicationPref(result1.meta_value);
          applicationFormobj.medium = medium;
          
        }

        if (result1.meta_key == "clients-types")
        {
          var services = await getCommunicationPref(result1.meta_value);

          applicationFormobj.services = services;
        }

        if (result1.meta_key == "approximate-availability-hours-per-week")
        {
          applicationFormobj.approximate_availability_hours_per_week = result1.meta_value;
        }

        if (result1.meta_key == "please-include-a-description-about-yourself-for-your-profile")
        {
          applicationFormobj.please_include_a_description_about_yourself_for_your_profile = result1.meta_value;
        }


        if (result1.meta_key == "length-of-experience")
        {
          applicationFormobj.length_of_experience = result1.meta_value;
        }

        
        
      }
    }
    applicationForm.push(applicationFormobj);
    arr.push(obj);
  }

  async function insertApplicationForm(post_id,user_id,email) {
    for (const result1 of applicationForm) 
    {
      
      if (result1.post_id == post_id)
      {
        var values_therapist_details = [[user_id,result1.languages,result1.first_name,result1.middle_name,result1.last_name,
          result1.length_of_experience,result1.medium,result1.services,
          result1.approximate_availability_hours_per_week,"Asia/Singapore",CurrentDate,CurrentDate,email]];
        var sql =
        "INSERT INTO applications (therapist_id_FK,language_id_fk,first_name,middle_name,last_name,length_of_experience,medium_are_you_able_to_use_for_counselling,services_are_you_able_to_provide,approximate_availability,time_zone,created_at,updated_at,email) VALUES ?";
        const [rows6, fields6] = await db.connection1.query(sql, [values_therapist_details]);
      }
    }
  }

  // console.log(arr);
  // return;

  let ids = [];
  let userRecords = [];
  arr.map((val, i) => {
    rows3.map((val1, i1) => {
      if (val[6] == val1.user_login) {
        ids.push(val1.ID);
        val.push(val1.ID, val1.user_email);
        val1.post_id = val[0];
      }
      userRecords.push(val1);
    });
  });

  // console.log(userRecords);
  // return;

  let user = [];
  userRecords.map((val, i) => {
    let ar = [];
    if (ids.includes(val.ID)) {
      ar.push(2);
    } else {
      ar.push(3);
    }
    ar.push(val.post_id,val.ID, val.user_login, val.user_email, "+65");
    user.push(ar);
  });

  // console.log(user);
  // return;

  user.map((val, i) => {
    rows4.map((val1, i1) => {
      if (val[2] == val1.user_id) {
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
    if (val.length == 8) {
      val.push("");
    }
  });

  


  // console.log(user);

  for (var records of user) 
  {
    // console.log(records);

    // return;

    

    var post_id = records[1];
    var email = records[4];

    const index = records.indexOf(post_id);
    if (index > -1) {
      records.splice(index, 1); // 2nd parameter means remove one item only
    }

    // $2y$10$I3Q13uNA/Cjc.47N7lE3MexM3I7sn3Yiqo55vBwwSMg4EvoXO9PZO

    // array = [2, 9]
    // console.log(records); 



    records[records.length] = CurrentDate;
    records[records.length] = CurrentDate;
    // console.log(records);

    // break;

    var sql =
    "INSERT INTO users (usertype,post_id,mobile_no,email,dial_code,first_name,last_name,middle_name,created_at,updated_at) VALUES ?";

    const [rows5, fields5] = await db.connection1.query(sql, [[records]]);

    var user_id = rows5.insertId;
    var user_type = records[0];

    const firstName = records[5];
   
    const Username = firstName.substr( 0, 3);
    const UserID = Username + "_" + user_id;
    await db.connection1.query('UPDATE users SET ? WHERE id = ?', [{ "user_id": UserID }, user_id]);

    // therapist_details insert
    if (user_type == 2)
    {
      await insertApplicationForm(post_id,user_id,email);
      
      var values_therapist_details = [[1,1,5,user_id,"Asia/Singapore",CurrentDate,CurrentDate]];
      var sql =
      "INSERT INTO therapist_details (service_id_fk,medium_id_fk,country_id_fk,therapist_id_FK,my_timezone,created_at,updated_at) VALUES ?";
      const [rows6, fields6] = await db.connection1.query(sql, [values_therapist_details]);
    }

    

  }
  // 

  // console.log("Insertion complete");

  
};
