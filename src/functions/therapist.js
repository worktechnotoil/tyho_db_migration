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

  var therapistArray = [
    [ 2108, '+65', '2', 'Alice', 'Ho', 'Tan', '91502691' ],
    [ 2117, '+65', '2', 'Alyssa', '', 'Fernandez', '92270011' ],
    [ 2124, '+65', '2', 'Edmund', '', 'Chong', '96729150' ],
    [ 2505, '+65', '2', 'Karen', '', 'Chok', '82222358' ],
    [ 2560, '+65', '2', 'Lira', '', 'Low', '0788243906' ],
    [ 2998, '+65', '2', 'Rashmi', '', 'Kunzru', '88785532' ],
    [ 5957, '+65', '2', 'Alicia', '', 'Prescott', '431245764' ],
    [ 7155, '+65', '2', 'Desieree', '', 'Makalew', '91911075' ],
    [ 7654, '+65', '2', 'Alexandra', '', 'Oh', '81265787' ],
    [ 11949, '+65', '2', 'Ser', '', 'Fee', '87761420' ],
    [ 12205, '+65', '2', 'Punitha', '', 'Gunasegaran', '97985232' ],
    [ 13366, '+65', '2', 'Joseph', '', 'Quek', '91786090' ],
    [ 15355, '+65', '2', 'Priyahnisha', '', 'N', '97769067' ],
    [ 18914, '+65', '2', 'Jeanette', '', 'Houmayune', '98736150' ],
    [ 19968, '+65', '2', 'Beena', '', 'D Raj', '90466269' ],
    [ 20326, '+65', '2', 'Kayden', '', 'Sharon Perera', '91266276' ],
    [ 21195, '+65', '2', 'Li Nah', '', 'Loh', '93868999' ],
    [ 23557, '+65', '2', 'Rathi', '', 'Lieberum', '91704019' ],
    [ 1517, '+65', '2', 'Michael', '', 'Thong', '81682985' ],
    [ 57, '+65', '2', 'Darren', '', 'Lim', '96677264' ],
    [ 55, '+65', '2', 'Elisa', '', 'Kang', '94308666' ],
  ];

  // {"name":"Michael Thong","mobile":"81682985","email":"thong.michael@gmail.com"},//Disabled therapist
  //   {"name":"Darren Lim","mobile":"96677264","email":"dwklim@gmail.com"},//Disabled therapist
  //   {"name":"Elisa Kang","mobile":"94308666","email":"elisa.kang@gmail.com"},//Disabled therapist


  // console.log(therapistArray.length);
  // return;
  // var therapistArray = [
  //   {"name":"Lira Low","mobile":"0788243906","email":"liralow@gmail.com"},
  //   {"name":"Li Nah Loh","mobile":"93868999","email":"healingmoonwarrior@gmail.com"},
  //   {"name":"Kayden Sharon Perera","mobile":"91266276","email":"kaydensp@gmail.com"},
  //   {"name":"Alexandra Oh","mobile":"81265787","email":"lextremelybalanced@gmail.com"},
  //   {"name":"Alyssa Fernandez","mobile":"92270011","email":"alyssa.rose@gmail.com"},
  //   {"name":"Ser Fee","mobile":"87761420","email":"serfee@re-narrate.com"},
  //   {"name":"Jeanette Houmayune","mobile":"98736150","email":"jeanette.houmayune@gmail.com"},
  //   {"name":"Priyahnisha N","mobile":"97769067","email":"resetright@gmail.com"},
  //   {"name":"Beena D R","mobile":"90466269","email":"beena7_2000@yahoo.com.sg"},
  //   {"name":"Rashmi Kunzru","mobile":"88785532","email":"rashmi@pathwayscounselling.co"},
  //   {"name":"Joseph Quek","mobile":"91786090","email":"josephquek11@gmail.com"},
  //   {"name":"Desieree Makalew","mobile":"91911075","email":"desieree@gmail.com"},
  //   {"name":"Edmund Chong","mobile":"96729150","email":"edmund@healingspace.sg"},
  //   {"name":"Punitha Gunasegaran","mobile":"97985232","email":"punitha51@hotmail.com"},
  //   {"name":"Karen Chok","mobile":"82222358","email":"karen.integrow@gmail.com"},
  //   {"name":"Alicia Prescott","mobile":"431245764","email":"prescott.alicia@gmail.com"},
  //   {"name":"Alice Ho Tan","mobile":"91502691","email":"alice.integrow@gmail.com"},
  //   {"name":"Michael Thong","mobile":"81682985","email":"thong.michael@gmail.com"},//Disabled therapist
  //   {"name":"Rathi Lieberum","mobile":"91704019","email":"rathidavy@gmail.com"},
  //   {"name":"Darren Lim","mobile":"96677264","email":"dwklim@gmail.com"},//Disabled therapist
  //   {"name":"Elisa Kang","mobile":"94308666","email":"elisa.kang@gmail.com"},//Disabled therapist
  // ];



  
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

  

  const [rows100, fields100] = await db.connection1.execute(
    "TRUNCATE TABLE users"
  );

  const [rows101, fields101] = await db.connection1.execute(
    "TRUNCATE TABLE therapist_details"
  );

  const [rows102, fields102] = await db.connection1.execute(
    "TRUNCATE TABLE applications"
  );

  const [rows103, fields103] = await db.connection1.execute(
    "TRUNCATE TABLE languages"
  );

  const [rows104, fields104] = await db.connection1.execute(
    "TRUNCATE TABLE tbl_wallet"
  );

  const [rows105, fields105] = await db.connection1.execute(
    "TRUNCATE TABLE tbl_avalability"
  );

  const [rows106, fields106] = await db.connection1.execute(
    "TRUNCATE TABLE tbl_avalability_time_slots"
  );
  
  const [rows1063, fields1063] = await db.connection1.execute(
    "TRUNCATE TABLE onboardings"
  );

  const [rows10623, fields12063] = await db.connection1.execute(
    "TRUNCATE TABLE intakes"
  );

  var sql =
    "INSERT INTO users (usertype,user_id,first_name,last_name,email,password,time_zone,post_id) VALUES ?";
  
  const [rows5, fields5] = await db.connection1.query(sql, [[["1","sup_1","Super","Admin","shilpa+1@talkyourheartout.com","$2y$10$swQ8fcZPsIZvf2lehH76dufqtoLehOI.nej2a7Ozr.7RrfWTZ49v2","Asia/Singapore",""]]]);
  
  var CurrentDate = moment().format("YYYY-MM-DD HH:mm:ss");

  async function getLanguageId(languages) {
    
    const root = HTMLParser.parse(languages);


 
    var array_education = [];
    for (const iterator of root.querySelector('ul').childNodes) {
  
      var records = iterator.text;

      if(records.trim() == "")
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

    array_education = remove_duplicates_es6(array_education);
    return array_education.join();
  }

  function remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}

async function saveTherapistAvailability(value,therapist_id)
{
    for (let index = 0; index < 91; index = index + 1) {
        var threeMonthAfterDate = moment().tz("Asia/Singapore").add(index, 'day').format('YYYY-MM-DD');
    
        var dateFormat = moment().tz("Asia/Singapore").add(index, 'day').format('ddd')+"-details"
    
        var therapistAvai = await getTherapistAvailability(value,therapist_id,dateFormat);
    
        // console.log(therapistAvai);

        var values_tbl_avalability = [
            [therapist_id, threeMonthAfterDate,CurrentDate,CurrentDate]];
  
          var sql_tbl_avalability =
          "INSERT INTO tbl_avalability (therapist_id_fk,slot_date,created_at,updated_at) VALUES ?";
  
          const [rows5, fields5] = await db.connection1.query(sql_tbl_avalability, [values_tbl_avalability]);
          var tbl_avalability_id = rows5.insertId;

        if (therapistAvai !== undefined)
        {
          for (const iterator of therapistAvai.timeslots) {

            var values_tbl_avalability_time_slots = [
                [tbl_avalability_id,iterator.start_time,iterator.end_time,0,1,0,0,0,0,0,CurrentDate,CurrentDate]];
        
            var sql_values_tbl_avalability = 
            "INSERT INTO tbl_avalability_time_slots (avalability_id_fk,time_slot,end_time_slot,audio,video,textbasedchat,inperson,homevisit,is_booked,is_close,created_at,updated_at) VALUES ?";
    
            const [rows6, fields6] = await db.connection1.query(sql_values_tbl_avalability, [values_tbl_avalability_time_slots]);
        
          }
        }

        
        
    }
}


async function getTherapistAvailability(value,therapist_id,day)
{

    var result=unserialize(value);
    for(var attributename in result.__attr__){
        if (attributename == day)
        {
            // console.log(attributename);
            var timeObj ={};
            timeObj.day  = day;
            var timeslots = [];

            for (var key in result[attributename].__attr__){

                var timeSlotsObj ={};
                const start_time_old = key.split("-")[0];
                const end_time_old = key.split("-")[1];

                const start_time = moment(start_time_old, 'HHmm').format('hh:mm A');

                const end_time = moment(end_time_old, 'HHmm').format('hh:mm A');
                
                timeSlotsObj.start_time = start_time;
                timeSlotsObj.end_time = end_time;
                timeslots.push(timeSlotsObj);
                // console.log(key);
            }
            timeObj.timeslots = timeslots;
            return timeObj;
            break;
        }
    }
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
  var intakeFormData = [];


  // console.log(rows1);
  // return;


  // for (const result of rows1) {
  //   console.log(result);
  // }
  // for (const result in rows1) {
    
  //   console.log(result);
  // }

  // return;


  var usersData =[];

  // where_did_you_hear_of_us

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

        if (result1.meta_key == "calendar_shortcode")
        {
          var calender = result1.meta_value;
          calender = calender.split("=")[1];
          calender = calender.replace("]", "");

          const [rows, fields] = await db.connection.query("SELECT option_value FROM `xalfyiBase_options` WHERE `option_name` LIKE '%booked_defaults_"+calender+"%' ORDER BY `xalfyiBase_options`.`option_name` ASC");

          if (rows.length > 0)
          {
            applicationFormobj.calendar_shortcode = rows[0].option_value;
          }else
          {
            applicationFormobj.calendar_shortcode = "";
          }
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


  // console.log(applicationForm);

  // return;


  async function getUserType(post_id) {
    for (const result1 of therapistArray) 
    {
      if (result1[0] == post_id)
      {
       return 2; 
      }
    }
    return 3;
  }

  async function insertApplicationForm(post_id,user_id,email) {


    var postIdNotMatching = false;

    for (const result1 of applicationForm) 
    {
      
      if (result1.post_id == post_id)
      {
        postIdNotMatching = true;
        var values_therapist_details = [[user_id,result1.languages,result1.first_name,result1.middle_name,result1.last_name,
          result1.length_of_experience,result1.medium,result1.services,
          result1.approximate_availability_hours_per_week,"Asia/Singapore",CurrentDate,CurrentDate,email]];
        var sql =
        "INSERT INTO applications (therapist_id_FK,language_id_fk,first_name,middle_name,last_name,length_of_experience,medium_are_you_able_to_use_for_counselling,services_are_you_able_to_provide,approximate_availability,time_zone,created_at,updated_at,email) VALUES ?";
        const [rows6, fields6] = await db.connection1.query(sql, [values_therapist_details]);


        var values_therapist_details = [[user_id,"Asia/Singapore",CurrentDate,CurrentDate,"24 hr"]];

        var sql =
        "INSERT INTO onboardings (therapist_id_FK,time_zone,created_at,updated_at,select_preferred_notice_period_for_new_booking) VALUES ?";
        const [rows600, fields600] = await db.connection1.query(sql, [values_therapist_details]);

        // console.log(result1.calendar_shortcode);

        try {
          await saveTherapistAvailability(result1.calendar_shortcode.toString(),user_id);
        } catch (error) {
          console.error(error);
          console.log("user_id :: "+user_id+" result1.first_name :: "+result1.first_name+"result1.calendar_shortcode :: "+result1.calendar_shortcode );
        }

        
      }
    }

    if (postIdNotMatching == false)
    {
      var values_therapist_details = [[user_id,"Asia/Singapore",CurrentDate,CurrentDate,email]];
      var sql =
      "INSERT INTO applications (therapist_id_FK,time_zone,created_at,updated_at,email) VALUES ?";
      const [rows6, fields6] = await db.connection1.query(sql, [values_therapist_details]);


      var values_therapist_details = [[user_id,"Asia/Singapore",CurrentDate,CurrentDate,"24 hr"]];

      var sql =
      "INSERT INTO onboardings (therapist_id_FK,time_zone,created_at,updated_at,select_preferred_notice_period_for_new_booking) VALUES ?";
      const [rows600, fields600] = await db.connection1.query(sql, [values_therapist_details]);

      
    }
  }

  async function insertIntakeForm(match_id,user_id) {
    for (const result1 of intakeFormData) 
    {
      if (result1.user_id == match_id)
      {
        var values_intake_details = [[
          user_id,result1.age,result1.gender,result1.emergency_contact_person_details_name,result1.emergency_contact_person_details_relationship_with_you,
          result1.emergency_contact_person_details_phone_number,result1.current_relationship,result1.your_occupation,
          result1.highest_educational_qualifications,result1.previously_session,result1.last_consulted_on,
          result1.currently_consulting,result1.what_they_are_helping,result1.specific_goal,CurrentDate,CurrentDate]];

        var sql =
        "INSERT INTO intakes (user_id,age,gender,name,relationship,mobile,your_relationship_status,your_occupation,highest_qualifications,previously_had_any_sessions_with_anyone,if_yes_last_consulted,are_you_currently_consulting_with_anyone,if_yes_they_are_helping_you,share_personal_and_professional_goals,created_at,updated_at) VALUES ?";
        const [rows6, fields6] = await db.connection1.query(sql, [values_intake_details]);
      }
    }
  }

  // console.log(arr.length);
  // return;

  function getPostId(user_login) {

    for (const iterator of therapistArray) {
      if (iterator[6] == user_login) {
        return iterator[0];
      }
    }
  }
  
  let ids = [];
  let userRecords = [];
  arr.map((val, i) => {
    rows3.map((val1, i1) => {
      if (val[6] == val1.user_login) {
        ids.push(val1.ID);
        val.push(val1.ID, val1.user_email);
        
      }
      // userRecords.push(val1);
    });
  });

  // console.log(arr);
  // return;

  let user = [];
  rows3.map((val, i) => {
    let ar = [];
    if (ids.includes(val.ID)) {
      ar.push(2);
    } else {
      ar.push(3);
    }

    // if(val.post_id !== undefined)
    // {
    //   ar.push(val.post_id,val.ID, val.user_login, val.user_email, "+65");
    // }else
    // {
      ar.push(val.ID, val.user_login, val.user_email, "+65");
    // }
    user.push(ar);
  });

  // console.log(user);
  // return;

  var WalletArray = [];


  user.map((val, i) => {
    let intakeFormobj = {};
    let userOtherData = {};
    userOtherData.user_id = val[1];
    intakeFormobj.user_id = val[1];

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

        if (val1.meta_key == "_uw_balance") {

          var obj = {};
          obj.user_id = val1.user_id;
          obj.wallet_balance = val1.meta_value;
          WalletArray.push(obj);
        }

        if (val1.meta_key == "gender")
        {
          intakeFormobj.gender = val1.meta_value;
        }

        if (val1.meta_key == "age")
        {
          intakeFormobj.age = val1.meta_value;
        }

        if (val1.meta_key == "current_relationship")
        {
          intakeFormobj.current_relationship = val1.meta_value;
        }

        if (val1.meta_key == "your_occupation")
        {
          intakeFormobj.your_occupation = val1.meta_value;
        }

        if (val1.meta_key == "highest_educational_qualifications")
        {
          intakeFormobj.highest_educational_qualifications = val1.meta_value;
        }

        if (val1.meta_key == "emergency_contact_person_details_name")
        {
          intakeFormobj.emergency_contact_person_details_name = val1.meta_value;
        }

        if (val1.meta_key == "emergency_contact_person_details_phone_number")
        {
          intakeFormobj.emergency_contact_person_details_phone_number = val1.meta_value;
        }

        if (val1.meta_key == "emergency_contact_person_details_relationship_with_you")
        {
          intakeFormobj.emergency_contact_person_details_relationship_with_you = val1.meta_value;
        }

        if (val1.meta_key == "previously_session")
        {
          intakeFormobj.previously_session = val1.meta_value;
        }

        if (val1.meta_key == "last_consulted_on")
        {
          intakeFormobj.last_consulted_on = val1.meta_value;
        }

        if (val1.meta_key == "currently_consulting")
        {
          intakeFormobj.currently_consulting = val1.meta_value;
        }

        if (val1.meta_key == "what_they_are_helping")
        {
          intakeFormobj.what_they_are_helping = val1.meta_value;
        }

        if (val1.meta_key == "specific_goal")
        {
          intakeFormobj.specific_goal = val1.meta_value;
        }

        if (val1.meta_key == "where_did_you_hear_of_us")
        {
          userOtherData.where_did_you_hear_of_us = val1.meta_value;
        }

        if (val1.meta_key == "others")
        {
          userOtherData.others = val1.meta_value;
        }

        
        
        
        
      }
    });

    intakeFormData.push(intakeFormobj);
    usersData.push(userOtherData);
    

    // console.log(val.length);
    // return;
    if (val.length == 7) {
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


// if (val1.meta_key == "where_did_you_hear_of_us")
//         {
//           userOtherData.where_did_you_hear_of_us = val1.meta_value;
//         }

//         if (val1.meta_key == "others")
//         {
//           userOtherData.others = val1.meta_value;
//         }



function geUserDataothers(user_id) {

  for (const iterator of usersData) {

    if (iterator.user_id == user_id)
    {
      // if (iterator.key == key)
      // {
        return iterator.others;
      // }
      
    }
  }
}
function geUserDatawhere_did_you_hear_of_us(user_id) {
  
  for (const iterator of usersData) {
    
    if (iterator.user_id == user_id)
    {
      // if (iterator.key == key)
      // {
        return iterator.where_did_you_hear_of_us;
      // }
      
    }
  }
}




  // console.log(user.length);

  // return;

  for (var records of user) 
  {
    console.log(records);



    // return;

    

    var post_id = getPostId(records[2]) ;

    // return;
    var email = records[4];

    // console.log(records);

    

    // if (post_id !== undefined)
    // {
    //   console.log(post_id);
    // }
    // return;

    // console.log(post_id);
    // return;

    // const index = records.indexOf(post_id);
    // if (index > -1) {
    //   records.splice(index, 1); // 2nd parameter means remove one item only
    // }

    // $2y$10$I3Q13uNA/Cjc.47N7lE3MexM3I7sn3Yiqo55vBwwSMg4EvoXO9PZO

    // array = [2, 9]
    // console.log(records); 
    // return;

    
    records[0] = await getUserType(post_id);

    var user_type = records[0];

    console.error("user_type :: "+user_type+" post_id :: "+post_id);
    // return;
    


    records[records.length] = CurrentDate;
    records[records.length] = CurrentDate;
    records[records.length] = geUserDatawhere_did_you_hear_of_us(records[1]);
    records[records.length] = geUserDataothers(records[1]);
    
    // break;

    var sql =
    "INSERT INTO users (usertype,post_id,mobile_no,email,dial_code,first_name,last_name,middle_name,created_at,updated_at,how_did_you_find_us,find_us_other) VALUES ?";

    const [rows5, fields5] = await db.connection1.query(sql, [[records]]);

    var user_id = rows5.insertId;
    
    var old_data_user_id = records[1];

    const firstName = records[5];
   
    const Username = firstName.substr( 0, 3);
    const UserID = Username + "_" + user_id;
    await db.connection1.query('UPDATE users SET ? WHERE id = ?', [{ "user_id": UserID }, user_id]);

    // therapist_details insert
    if (user_type == 2)
    {
      var email = records[3];
      await insertApplicationForm(post_id,user_id,email);
      
      var values_therapist_details = [[5,user_id,"Asia/Singapore",CurrentDate,CurrentDate]];
      var sql =
      "INSERT INTO therapist_details (country_id_fk,therapist_id_FK,my_timezone,created_at,updated_at) VALUES ?";
      const [rows6, fields6] = await db.connection1.query(sql, [values_therapist_details]);
    }else
    {

      await insertIntakeForm(old_data_user_id,user_id);

      var walletAmount = getWalletAmount(records[1]);

      if(parseFloat(walletAmount) > 0)
      {
        // console.log("Wallet Amount :: "+walletAmount+" Email Id ::"+email)
        var expiry_date = moment().add(2, 'years').format("YYYY-MM-DD");
        var values_therapist_details = [[user_id,5,expiry_date,walletAmount,15,"Credit",CurrentDate,walletAmount,walletAmount,"Asia/Singapore",CurrentDate,CurrentDate]];
        var sql =
        "INSERT INTO tbl_wallet (client_id_fk,country_id_fk,expiry_date,amount,type_for_text,type,date,amount_left,balance,time_zone,created_at,updated_at) VALUES ?";
        const [rows7, fields7] = await db.connection1.query(sql, [values_therapist_details]);
      }

    

    }
  // 
  }
  console.log("Insertion complete");


  
};
