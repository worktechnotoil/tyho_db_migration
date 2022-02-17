const connect = require("../utils/connect");
const moment = require("moment");
var unserialize=require("php-serialization").unserialize;
var HTMLParser = require('node-html-parser');

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

  async function getLanguageId(languages) {
    
    const root = HTMLParser.parse(languages);


 
    var array_education = [];
    for (const iterator of root.querySelector('ul').childNodes) {
  
      var records = iterator.text;

      if(records == "")
      {
        continue;
      }

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


  var WalletArray = [];

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
        if (val1.meta_key == "_uw_balance") {

          var obj = {};
          obj.user_id = val1.user_id;
          obj.wallet_balance = val1.meta_value;
          WalletArray.push(obj);
        }
      }
    });
    if (val.length == 8) {
      val.push("");
    }
  });

  

function getWalletAmount(user_id) {
  
  for (const iterator of WalletArray) {
    
    if (iterator.user_id == user_id)
    {
      return iterator.wallet_balance;
    }
  }
}

  // console.log(user);

  // return;

  for (var records of user) 
  {

    


    var post_id = records[1];
    var email = records[4];

    const index = records.indexOf(post_id);
    if (index > -1) {
      records.splice(index, 1); // 2nd parameter means remove one item only
    }

    records.splice(8, 1);

    records[records.length] = CurrentDate;
    records[records.length] = CurrentDate;

    var walletAmount = getWalletAmount(records[1]);
 
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
      
      var values_therapist_details = [[,5,user_id,"Asia/Singapore",CurrentDate,CurrentDate]];
      var sql =
      "INSERT INTO therapist_details (country_id_fk,therapist_id_FK,my_timezone,created_at,updated_at) VALUES ?";
      const [rows6, fields6] = await db.connection1.query(sql, [values_therapist_details]);
    }else
    {

      if(parseFloat(walletAmount) > 0)
      {
        console.log("Wallet Amount :: "+walletAmount+" Email Id ::"+email)
        var expiry_date = moment().add(2, 'years').format("YYYY-MM-DD");
        var values_therapist_details = [[user_id,5,expiry_date,walletAmount,15,"Credit",CurrentDate,walletAmount,walletAmount,"Asia/Singapore",CurrentDate,CurrentDate]];
        var sql =
        "INSERT INTO tbl_wallet (client_id_fk,country_id_fk,expiry_date,amount,type_for_text,type,date,amount_left,balance,time_zone,created_at,updated_at) VALUES ?";
        const [rows7, fields7] = await db.connection1.query(sql, [values_therapist_details]);
      }

      

    }

    

  }
  // 

  console.log("Insertion complete");

  
};


  // {
  //   user_id: 107,
  //   gender: 'Female',
  //   age: '18-24',
  //   previously_session: 'No',
  //   last_consulted_on: '',
  //   currently_consulting: 'Yes',
  //   what_they_are_helping: 'Test query for submission',
  //   current_relationship: 'Single',
  //   your_occupation: 'Test query for submission',
  //   highest_educational_qualifications: 'Undergraduate degree',
  //   emergency_contact_person_details_name: 'Vinay Sahu',
  //   emergency_contact_person_details_phone_number: '7415503451',
  //   emergency_contact_person_details_relationship_with_you: 'Client'
  // },

  // a:11:{s:6:"Monday";s:5:"false";s:7:"Tuesday";s:5:"false";s:9:"Wednesday";s:5:"false";s:8:"Thursday";s:5:"false";s:6:"Friday";s:5:"false";s:8:"Saturday";s:5:"false";s:6:"Sunday";s:5:"false";s:7:"Morning";s:5:"false";s:9:"Afternoon";s:5:"false";s:7:"Evening";s:5:"false";s:5:"Night";s:5:"false";}


  i: 138;a: 316: {
		s: 10: "2020-06-10";a: 1: {
			s: 9: "1430-1530";b: 1;
		}
		s: 10: "2020-06-11";a: 1: {
			s: 9: "1630-1730";b: 1;
		}
		s: 10: "2020-06-12";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1430-1530";b: 1;
		}
		s: 10: "2020-06-04";a: 3: {
			s: 9: "1130-1230";b: 1;s: 9: "1430-1530";b: 1;s: 9: "1630-1730";b: 1;
		}
		s: 10: "2020-06-17";a: 2: {
			s: 9: "1430-1530";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2020-06-18";a: 2: {
			s: 9: "1430-1530";b: 1;s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-06-19";a: 2: {
			s: 9: "1430-1530";b: 1;s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-06-13";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-07-02";a: 4: {
			s: 9: "1130-1230";b: 1;s: 9: "1630-1730";b: 1;s: 9: "1430-1530";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-07-03";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1430-1530";b: 1;
		}
		s: 10: "2020-07-01";a: 1: {
			s: 9: "1430-1530";b: 1;
		}
		s: 10: "2020-07-09";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1430-1530";b: 1;
		}
		s: 10: "2020-07-16";a: 2: {
			s: 9: "1430-1530";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-07-30";a: 1: {
			s: 9: "1430-1530";b: 1;
		}
		s: 10: "2020-07-08";a: 1: {
			s: 9: "1430-1530";b: 1;
		}
		s: 10: "2020-07-15";a: 3: {
			s: 9: "1430-1530";b: 1;s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-07-22";a: 1: {
			s: 9: "1430-1530";b: 1;
		}
		s: 10: "2020-07-29";a: 1: {
			s: 9: "1430-1530";b: 1;
		}
		s: 10: "2020-07-10";a: 2: {
			s: 9: "1430-1530";b: 1;s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-07-17";a: 2: {
			s: 9: "1430-1530";b: 1;s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-07-24";a: 2: {
			s: 9: "1430-1530";b: 1;s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-07-31";a: 2: {
			s: 9: "1430-1530";b: 1;s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-06-24";a: 2: {
			s: 9: "1430-1530";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2020-06-25";a: 3: {
			s: 9: "1130-1230";b: 1;s: 9: "1430-1530";b: 1;s: 9: "1630-1730";b: 1;
		}
		s: 10: "2020-06-26";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1430-1530";b: 1;
		}
		s: 10: "2020-07-23";a: 1: {
			s: 9: "1430-1530";b: 1;
		}
		s: 10: "2020-07-25";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-07-11";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-08-07";a: 1: {
			s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-08-08";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-08-06";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-08-12";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-08-14";a: 1: {
			s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-08-15";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-08-21";a: 1: {
			s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-08-28";a: 1: {
			s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-08-22";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-08-27";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-08-20";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-08-26";a: 1: {
			s: 9: "1600-1700";b: 1;
		}
		s: 10: "2020-08-29";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-09-02";a: 0: {}
		s: 10: "2020-09-05";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-09-03";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-09-10";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-09-17";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-09-24";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-10-08";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-10-15";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-09-09";a: 1: {
			s: 9: "1600-1700";b: 1;
		}
		s: 10: "2020-09-11";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-09-18";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-09-25";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-10-02";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-09-26";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-10-09";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-09-23";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-09-30";a: 0: {}
		s: 10: "2020-10-17";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-10-22";a: 0: {}
		s: 10: "2020-10-14";a: 1: {
			s: 9: "1600-1700";b: 1;
		}
		s: 10: "2020-10-16";a: 1: {
			s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-10-24";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-10-23";a: 0: {}
		s: 10: "2020-10-30";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-10-21";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-10-29";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-10-28";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-10-31";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-11-13";a: 1: {
			s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-11-07";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-11-14";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-11-28";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-11-21";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-12-05";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-11-20";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-11-11";a: 1: {
			s: 9: "1600-1700";b: 1;
		}
		s: 10: "2020-11-12";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-11-18";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-12-09";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-12-10";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-12-11";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-12-25";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-12-31";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-01-01";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-01-08";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-01-02";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-01-09";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-01-16";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-01-23";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-01-30";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-02-06";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-02-13";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-02-20";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-02-27";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-01-15";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-01-22";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-01-29";a: 2: {
			s: 9: "1300-1400";b: 1;s: 9: "1130-1230";b: 1;
		}
		s: 10: "2020-12-12";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-12-19";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-12-26";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2020-12-24";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-01-07";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-11-26";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-12-04";a: 1: {
			s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-11-27";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-12-02";a: 1: {
			s: 9: "1600-1700";b: 1;
		}
		s: 10: "2020-12-03";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-12-17";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-11-25";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-02-12";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2020-12-30";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-12-16";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2020-12-23";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-02-05";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-02-26";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-03-12";a: 1: {
			s: 9: "1130-1230";b: 1;
		}
		s: 10: "2021-03-19";a: 1: {
			s: 9: "1130-1230";b: 1;
		}
		s: 10: "2021-03-26";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-04-02";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-04-09";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-04-16";a: 0: {}
		s: 10: "2021-03-06";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-03-13";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-03-20";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-03-27";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-04-03";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-04-10";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-04-17";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-04-24";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-01-13";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-02-10";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-02-24";a: 1: {
			s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-01-21";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-02-03";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-01-27";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-02-17";a: 0: {}
		s: 10: "2021-02-11";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-05-01";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-05-08";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-05-22";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-05-29";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-06-05";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-06-26";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-06-19";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-06-12";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-06-04";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-06-11";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-06-18";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-06-25";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-05-07";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-05-14";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-05-21";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-05-28";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-04-23";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-04-30";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-02-19";a: 1: {
			s: 9: "1130-1230";b: 1;
		}
		s: 10: "2021-03-03";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-03-05";a: 1: {
			s: 9: "1130-1230";b: 1;
		}
		s: 10: "2021-03-17";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-06-02";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-06-09";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-06-16";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-06-23";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-06-30";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-07-07";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-07-14";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-07-21";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-07-28";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-08-04";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-08-11";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-08-18";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-08-25";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-09-01";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-09-08";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-09-15";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-09-22";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-09-29";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-10-06";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-10-13";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-10-20";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-10-27";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-11-03";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-11-10";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-11-17";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-11-24";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-12-01";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-12-08";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-12-15";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-12-22";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-12-29";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-03-25";a: 0: {}
		s: 10: "2021-03-18";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-03-24";a: 0: {}
		s: 10: "2021-03-10";a: 1: {
			s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-04-14";a: 1: {
			s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-04-28";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-04-22";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-04-15";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-09-18";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-04-08";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-05-13";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-05-05";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-04-21";a: 1: {
			s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-05-26";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-05-27";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-05-12";a: 2: {
			s: 9: "1600-1700";b: 1;s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-05-19";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2021-05-20";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-07-02";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-07-03";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-07-09";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-07-16";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-07-23";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-07-30";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-07-10";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-07-17";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-07-24";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-07-31";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-08-06";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-08-07";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-08-13";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-08-14";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-08-20";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-08-21";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-08-27";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-08-28";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-07-15";a: 0: {}
		s: 10: "2021-07-29";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-07-08";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-09-03";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-09-10";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-09-17";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-09-24";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-09-04";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-09-11";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-09-25";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-10-01";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-10-08";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-10-15";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-10-22";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-10-29";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-10-02";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-10-09";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-10-16";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-10-23";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-10-30";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-11-05";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-11-06";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-11-12";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-11-13";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-11-19";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-11-20";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-11-26";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-11-27";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-12-03";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-12-10";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-12-17";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-12-24";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-12-31";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2021-12-04";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-12-18";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-12-25";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-08-12";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-08-26";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-09-23";a: 0: {}
		s: 10: "2021-09-09";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-09-02";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-12-11";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2021-10-21";a: 0: {}
		s: 10: "2021-11-18";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-12-23";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1700-1800";b: 1;
		}
		s: 10: "2021-12-30";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1700-1800";b: 1;
		}
		s: 10: "2022-01-07";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2022-01-14";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2022-01-21";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2022-01-28";a: 2: {
			s: 9: "1130-1230";b: 1;s: 9: "1300-1400";b: 1;
		}
		s: 10: "2022-01-01";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2022-01-08";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2022-01-15";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2022-01-22";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2022-01-29";a: 1: {
			s: 9: "1200-1300";b: 1;
		}
		s: 10: "2022-01-05";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-01-12";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-01-19";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-01-26";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-11-25";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-10-14";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-10-28";a: 0: {}
		s: 10: "2021-11-11";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-12-02";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-12-09";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2021-12-16";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2022-02-02";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-02-09";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-02-16";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-02-23";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-03-02";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-03-09";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-03-16";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-03-23";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-03-30";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1600-1700";b: 1;
		}
		s: 10: "2022-04-06";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2022-04-13";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2022-02-03";a: 1: {
			s: 9: "1730-1830";b: 1;
		}
		s: 10: "2022-01-06";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1700-1800";b: 1;
		}
		s: 10: "2022-01-20";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1700-1800";b: 1;
		}
		s: 10: "2022-01-27";a: 2: {
			s: 9: "1730-1830";b: 1;s: 9: "1700-1800";b: 1;
		}
		s: 10: "2022-01-13";a: 1: {
			s: 9: "1700-1800";b: 1;
		}
		s: 10: "2022-02-17";a: 0: {}
		s: 10: "2022-02-24";a: 1: {
			s: 9: "1700-1800";b: 1;
		}
		s: 10: "2022-03-03";a: 1: {
			s: 9: "1700-1800";b: 1;
		}
		s: 10: "2022-03-10";a: 1: {
			s: 9: "1700-1800";b: 1;
		}
		s: 10: "2022-03-17";a: 1: {
			s: 9: "1700-1800";b: 1;
		}
		s: 10: "2022-03-24";a: 1: {
			s: 9: "1700-1800";b: 1;
		}
		s: 10: "2022-03-31";a: 1: {
			s: 9: "1700-1800";b: 1;
		}
	}